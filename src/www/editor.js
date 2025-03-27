var tables = [
    {
        name: "tenant",
        germanName: "mieter",
        displayName: "Mieter",
        nameField: "vorname",
        model: [
            { title: "First Name", data: "vorname", type: "text", defaultContent: "" },
            { title: "Last Name", data: "nachname", type: "text", defaultContent: "" },
            { title: "Phone", data: "telefonnummer", type: "text", defaultContent: "" },
            { title: "Geburtsdatum", data: "geburtsdatum", type: "date", defaultContent: "1970-01-01" },
            { title: "Email", data: "email", type: "text", defaultContent: "" },
            { title: "Strasse", data: "adresse.strasse", type: "text", defaultContent: "" },
            { title: "Hausnummer", data: "adresse.hausnummer", type: "text", defaultContent: "" },
            { title: "Postleizahl", data: "adresse.plz", type: "text", defaultContent: "" },
            { title: "Stadt", data: "adresse.stadt", type: "text", defaultContent: "" },
        ]
    },
    {
        name: "contract",
        germanName: "mietvertrag",
        displayName: "Mietverträge",
        nameField: "_id",
        model: [
            { title: "Vertragsbeginn", data: "vertragsbeginn", type: "date", defaultContent: "1970-01-01" },
            { title: "Vertragsende", data: "vertragsende", type: "date", defaultContent: "1970-01-01" },
            { title: "Mietzins", data: "mietzins", type: "number", defaultContent: 0 },
            { title: "Kaution", data: "kaution", type: "number", defaultContent: 0 },
            { title: "Status", data: "status", type: "text", defaultContent: "" },
            { title: "Mieter", data: "mieter_id", type: "reference", defaultContent: "" },
            { title: "Mietobjekt", data: "mietobjekt_id", type: "reference", defaultContent: "" },
        ]
    },
    {
        name: "unit",
        germanName: "mietobjekt",
        displayName: "Mietobjekte",
        nameField: "bezeichnung",
        model: [
            { title: "Bezeichnung", data: "bezeichnung", type: "text", defaultContent: "" },
            { title: "Typ", data: "typ", type: "text", defaultContent: "" },
            { title: "Fläche", data: "fläche_m2", type: "number", defaultContent: 0 },
            { title: "Zimmeranzahl", data: "zimmeranzahl", type: "number", defaultContent: 0 },
            { title: "Miete", data: "miete", type: "number", defaultContent: 0 },
            { title: "Verfügbar Ab", data: "verfügbar_ab", type: "date", defaultContent: "1970-01-01" },
            { title: "Status", data: "status", type: "text", defaultContent: "" },
            { title: "Ausstattungen", data: "ausstattungen", type: "array/text", defaultContent: [] },
            { title: "Mieter", data: "mieter_id", type: "reference", defaultContent: "" },
            { title: "Liegenschaft", data: "liegenschaft_id", type: "reference", defaultContent: "" },
        ]
    },
    {
        name: "property",
        germanName: "liegenschaft",
        displayName: "Liegenschaften",
        nameField: "name",
        model: [
            { title: "Name", data: "name", type: "text", defaultContent: "" },
            { title: "Strasse", data: "adresse.strasse", type: "text", defaultContent: "" },
            { title: "Hausnummer", data: "adresse.hausnummer", type: "text", defaultContent: "" },
            { title: "Postleizahl", data: "adresse.plz", type: "text", defaultContent: "" },
            { title: "Stadt", data: "adresse.stadt", type: "text", defaultContent: "" },
            { title: "Baujahr", data: "baujahr", type: "number", defaultContent: 0 },
            { title: "Wohnungen", data: "anzahl_wohnungen", type: "number", defaultContent: 0 },
            { title: "Parkplätze", data: "anzahl_parkplätze", type: "number", defaultContent: 0 },
            { title: "Besitzer", data: "besitzer", type: "text", defaultContent: "" }
        ]
    },
    {
        name: "payment",
        germanName: "zahlung",
        displayName: "Zahlungen",
        nameField: "mietvertrag_id",
        model: [
            { title: "Mietvertrag", data: "mietvertrag_id", type: "reference", defaultContent: "" },
            { title: "Datum", data: "datum", type: "date", defaultContent: "1970-01-01" },
            { title: "Betrag", data: "betrag", type: "number", defaultContent: "", defaultContent: 0 },
            { title: "Status", data: "status", type: "text", defaultContent: "" },
            { title: "Zahlungsart", data: "zahlungsart", type: "text", defaultContent: "" },
        ]
    },
    {
        name: "maintenance",
        germanName: "wartungsanfrage",
        displayName: "Wartungsanfragen",
        nameField: "beschreibung",
        model: [
            { title: "Beschreibung", data: "beschreibung", type: "text", defaultContent: "" },
            { title: "Datum", data: "status", type: "date", defaultContent: "" },
            { title: "Erstellt am", data: "erstellt_am", type: "date", defaultContent: "1970-01-01" },
            { title: "Handwerker", data: "zugewiesener_handwerker", type: "text", defaultContent: "" },
            { title: "Mietobjekt", data: "mietobjekt_id", type: "reference", defaultContent: "" },
        ]
    }
]

var params = new URLSearchParams(window.location.search);
var table = tables.find(t => t.name === params.get("table"));
var id = params.get("id");

console.log("Table: ", table);
console.log("ID: ", id);

var title = document.getElementById("title");
title.textContent = table.displayName;

var editor = document.getElementById("editor");
table.model.forEach(col => {
    var label = document.createElement("label");
    label.textContent = col.title;
    editor.appendChild(label);
    if (col.type === "text" || col.type === "number" || col.type === "date" || col.type === "array/text") {
        var input = document.createElement("input");
        input.className = "form-control";
        input.type = col.type.split("/")[1] || col.type;
        input.name = col.data;
        editor.appendChild(input);
    } else if (col.type === "reference") {
        var select = document.createElement("select");
        select.className = "form-control";
        select.name = col.data;
        editor.appendChild(select);
    }
});

table.model.filter(col => col.type === "reference").forEach(col => {
    const [refTable, refField] = col.data.split("_id");
    var refModel = tables.find(t => t.germanName === refTable);
    fetch(`/${refModel.name}`)
        .then(response => response.json())
        .then(data => {
            const select = editor.querySelector(`[name='${col.data}']`);
            data.data.forEach(item => {
                const option = document.createElement("option");
                option.value = item._id; // Assuming the ID field is named "id"
                option.textContent = item[refModel.nameField]; // Use the field name for display
                select.appendChild(option);
            });
        });
});

// get data for field population
if (id) {
    fetch(`/${table.name}/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            table.model.forEach(col => {
                const keys = col.data.split(".");
                let current = data;

                keys.forEach(key => {
                    current = current[key];
                });

                
                editor.querySelector(`[name='${col.data}']`).value = current;
            });
        });
}

function save() {
    var data = {};
    table.model.forEach(col => {
        const value = editor.querySelector(`[name='${col.data}']`).value;

        // Handle nested properties
        const keys = col.data.split(".");
        let current = data;

        if (col.type === "array/text") {
            console.log(current);
            current[col.data] = value.split(",");
        }

        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                // Set the value at the deepest level
                current[key] = value;
            } else {
                // Create the nested object if it doesn't exist
                if (!current[key]) {
                    current[key] = {};
                }
                current = current[key];
            }
        });
    });

    console.log(data);

    if (id) {
        fetch(`/${table.name}/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                window.location.href = `/index.html`;
            } else {
                alert("Fehler beim Speichern.");
            }
        }).catch(error => {
            console.error("Error:", error);
        });
    } else {
        fetch(`/${table.name}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                window.location.href = `/index.html`;
            } else {
                alert("Fehler beim Speichern.");
            }
        }).catch(error => {
            console.error("Error:", error);
        });
    }
}