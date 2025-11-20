const KRATOS_ADMIN = process.env.KRATOS_ADMIN_URL || "http://localhost:4434"

exports.addTenant = async (req, res) => {
    try {
        const { userId, schema_id, traits, state } = req.body

        const response = await fetch(
            `${KRATOS_ADMIN}/admin/identities/${userId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ schema_id, traits, state }),
            }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            return res.status(response.status).json(data)
        }

        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
