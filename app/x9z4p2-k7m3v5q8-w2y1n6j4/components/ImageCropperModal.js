"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn } from 'lucide-react';
import getCroppedImg from '../../utils/cropImage';

const ImageCropperModal = ({ imageSrc, originalFile, onClose, onCropComplete, aspect: initialAspect = 4 / 5 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [lockedAspect, setLockedAspect] = useState(true);

    const onCropChange = useCallback((location) => {
        setCrop(location);
    }, []);

    const onZoomChange = useCallback((zoomLevel) => {
        setZoom(zoomLevel);
    }, []);

    const onCropCompleteCallback = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            setProcessing(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            // Reconstroi um arquivo a partir do blob
            const file = new File([croppedImageBlob], "cropped-image.jpg", { type: "image/jpeg" });
            onCropComplete(file);
        } catch (e) {
            console.error("Crop error", e);
            // Fallback: tenta passar o original se falhar o crop, ou alerta erro
            if (originalFile) {
                onCropComplete(originalFile);
            } else {
                alert("Erro ao recortar imagem. Tente novamente.");
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleUseOriginal = () => {
        if (originalFile) {
            onCropComplete(originalFile);
        } else {
            // Fallback: se não tiver o arquivo original por algum motivo
            handleSave();
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                position: 'relative',
                width: '90%',
                maxWidth: '600px',
                height: '55%', // Reduced height to fit more controls
                background: '#333',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={lockedAspect ? initialAspect : undefined}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropCompleteCallback}
                    style={{
                        containerStyle: { background: '#222' },
                        mediaStyle: {},
                        cropAreaStyle: { border: '2px solid white' }
                    }}
                />
            </div>

            {/* Controls */}
            <div style={{
                marginTop: '15px',
                width: '90%',
                maxWidth: '600px',
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                {/* Options Row */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                    <button
                        type="button"
                        onClick={() => setLockedAspect(!lockedAspect)}
                        style={{
                            padding: '8px 15px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            background: lockedAspect ? '#e3f2fd' : 'white',
                            color: lockedAspect ? '#2196f3' : '#666',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {lockedAspect ? '🔒 Formato Fixo (4:5)' : '🔓 Formato Livre'}
                    </button>

                    <button
                        type="button"
                        onClick={handleUseOriginal}
                        style={{
                            padding: '8px 15px',
                            borderRadius: '20px',
                            border: '1px solid #2ecc71',
                            background: 'white',
                            color: '#2ecc71',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Usar Imagem Original (Sem Corte)
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ZoomIn size={20} color="#555" />
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(e.target.value)}
                        className="zoom-range"
                        style={{ width: '100%', cursor: 'pointer' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            background: '#f8f9fa',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            fontWeight: '600',
                            color: '#555'
                        }}
                    >
                        <X size={18} /> Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={processing}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--deep-purple)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            fontWeight: '600'
                        }}
                    >
                        {processing ? 'Processando...' : <><Check size={18} /> Recortar & Salvar</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
