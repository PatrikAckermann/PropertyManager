class apiController {
    constructor(d, collection) {
        this.endpoint = "/" + collection;
        d.express.get(this.endpoint, (req, res) => {
            d[collection].getAll()
                .then(tenants => {
                    res.send(tenants);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                });
        });

        d.express.get(`${this.endpoint}/:id`, (req, res) => {
            d[collection].getOne(req.params.id)
                .then(tenant => {
                    res.send(tenant);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                });
        });

        d.express.post(this.endpoint, (req, res) => {
            d[collection].add(JSON.parse(req.body))
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                });
        });

        d.express.put(`${this.endpoint}/:id`, (req, res) => {
            d[collection].update(req.params.id, JSON.parse(req.body))
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                });
        });

        d.express.delete(`${this.endpoint}/:id`, (req, res) => {
            d[collection].delete(req.params.id)
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                });
        });
    }
}

module.exports = apiController;