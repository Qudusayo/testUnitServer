require("dotenv").config()
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

    let currencies = currency.split(",");

    var date;
    var ourRate = {};
    const errors = [];

    axios
        .get(apiUri, { params: { base } })
        .then((response) => {
            var { status, data } = response;

            if (status !== 200) {
                return res.status(status).json(data);
            }

            currencies.forEach((exchangeCurrency) => {
                if (!data.rates[exchangeCurrency]) {
                    errors.push(exchangeCurrency);
                } else {
                    ourRate[exchangeCurrency] = data.rates[exchangeCurrency];
                }
            });
            date = data.date;

            if (errors.length) {
                return res.status(400).json({
                    error: `Currency ${errors.join(",")} is not supported.`,
                });
            } else {
                res.status(200).json({
                    results: {
                        base,
                        date,
                        rates: ourRate,
                    },
                });
            }
        })
        .catch((err) => {
            return res.status(err.response.status).json(err.response.data);
        });
});

module.exports = router;
