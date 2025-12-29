"use client";

import React, { useState } from "react";

export default function CatalogarPage() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Livro");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const produto = {
      nome: productName,
      preco: price,
      descricao: description,
      categoria: category,
      imagem: image ? URL.createObjectURL(image) : "https://via.placeholder.com/300x200.png?text=Sem+Imagem"
    };

    const produtosExistentes = JSON.parse(localStorage.getItem("produtos")) || [];
    produtosExistentes.push(produto);
    localStorage.setItem("produtos", JSON.stringify(produtosExistentes));

    alert("Produto cadastrado com sucesso!");

    setProductName("");
    setPrice("");
    setDescription("");
    setCategory("Livro");
    setImage(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Cadastrar Novo Produto</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="border p-2 w-full rounded-md"
          />
          <input
            type="text"
            placeholder="Preço (ex: R$ 50,00)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border p-2 w-full rounded-md"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full rounded-md"
          >
            <option>Livro</option>
            <option>Manga</option>
            <option>CD</option>
            <option>DVD</option>
            <option>Games</option>
          </select>
          <textarea
            placeholder="Descrição do Produto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-2 w-full rounded-md"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md mt-4"
          >
            Salvar Produto
          </button>
        </form>
      </div>
    </div>
  );
}
