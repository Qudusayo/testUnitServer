require("dotenv").config();
const express = require("express");
const axios = require("axios");

const router = express.Router();
const apiUri = process.env.API_URI;

router.get("/rates", (req, res) => {
    var { base, currency } = req.query;

    if (!base || !currency) {
        return res.status(400).json({
            error: "Invalid request. 'base' and 'currency' are required",
        });
    }

    axios
        .get(apiUri, { params: { base, symbols: currency } })
        .then((response) => {
            var { status, data } = response;

            if (status !== 200) {
                return res.status(status).json(data);
            }

            return res.status(200).json({
                results: {
                    base: data.base,
                    date: data.date,
                    rates: data.rates,
                },
            });
        })
        .catch((err) => {
            return res.status(err.response.status).json(err.response.data);
        });
});

module.exports = router;
