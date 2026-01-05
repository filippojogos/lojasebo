
const SUPER_FRETE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjcxMzkzMjcsInN1YiI6ImN0cHU1QXZPQ1FhTDhTclpzeTZnVXVCbU1jVzIifQ.1888j8k8Vn0sEEm6WoAVaYFJ3C4rinlip_lSRHH6qQc";

const packageData = {
    from: { postal_code: "05458001" },
    to: { postal_code: "20010020" }, // RJ Centro sample
    services: "1,2",
    package: {
        weight: 1,
        height: 5,
        width: 15,
        length: 20
    }
};

async function test() {
    console.log("Testing Super Frete Token...");
    try {
        const res = await fetch('https://api.superfrete.com/api/v0/calculator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPER_FRETE_TOKEN}`,
                'User-Agent': 'LojaSeboTest/1.0'
            },
            body: JSON.stringify(packageData)
        });

        if (res.ok) {
            const data = await res.json();
            console.log("SUCCESS:", JSON.stringify(data, null, 2));
        } else {
            const err = await res.text();
            console.error("FAILED:", res.status, err);
        }
    } catch (e) {
        console.error("ERROR:", e);
    }
}

test();
