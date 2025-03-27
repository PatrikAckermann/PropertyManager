var collections = ["tenant", "property", "maintenance", "contract", "unit", "payment"];
$.fn.dataTable.ext.errMode = 'none';
var tables = [
    {
        name: "tenant",
        displayName: "Mieter",
        model: [
            { title: "First Name", data: "vorname" },
            { title: "Last Name", data: "nachname" },
            { title: "Phone", data: "telefonnummer" },
            { title: "Geburtsdatum", data: "geburtsdatum" },
            { title: "Email", data: "email" }
        ]
    },
    {
        name: "contract",
        displayName: "Mietverträge",
        model: [
            { title: "ID", data: "_id" },
            { title: "Vertragsbeginn", data: "vertragsbeginn" },
            { title: "Vertragsende", data: "vertragsende" },
            { title: "Mietzins", data: "mietzins" },
            { title: "Kaution", data: "kaution" },
            { title: "Status", data: "status" },
        ]
    },
    {
        name: "unit",
        displayName: "Mietobjekte",
        model: [
            { title: "Bezeichnung", data: "bezeichnung" },
            { title: "Typ", data: "typ" },
            { title: "Fläche", data: "fläche_m2" },
            { title: "Zimmeranzahl", data: "zimmeranzahl" },
            { title: "Miete", data: "miete" },
            { title: "Verfügbar Ab", data: "verfügbar_ab" },
            { title: "Status", data: "status" },
            { title: "Ausstattungen", data: "ausstattungen" },
        ]
    },
    {
        name: "property",
        displayName: "Liegenschaften",
        model: [
            { title: "Name", data: "name" },
            { title: "Strasse", data: "adresse.strasse" },
            { title: "Hausnummer", data: "adresse.hausnummer" },
            { title: "Postleizahl", data: "adresse.plz" },
            { title: "Stadt", data: "adresse.stadt" },
            { title: "Baujahr", data: "baujahr" },
            { title: "Wohnungen", data: "anzahl_wohnungen" },
            { title: "Parkplätze", data: "anzahl_parkplätze" },
            { title: "Besitzer", data: "besitzer" }
        ]
    },
    {
        name: "payment",
        displayName: "Zahlungen",
        model: [
            { title: "Mietvertrag", data: "mietvertrag_id" },
            { title: "Datum", data: "datum" },
            { title: "Betrag", data: "betrag" },
            { title: "Status", data: "status" },
            { title: "Zahlungsart", data: "zahlungsart" }
        ]
    },
    {
        name: "maintenance",
        displayName: "Wartungsanfragen",
        model: [
            { title: "Beschreibung", data: "beschreibung" },
            { title: "Datum", data: "status" },
            { title: "Erstellt am", data: "erstellt_am" },
            { title: "Handwerker", data: "zugewiesener_handwerker" },
        ]
    }
]

var tablesElem = document.getElementById("tables");

function editRow(name, id) {
    window.location.href = `/editor.html?table=${name}&id=${id}`;
}

function deleteRow(name, id) {
    fetch(`/${name}/${id}`, {
        method: "DELETE"
    }).then(response => {
        if (response.ok) {
            console.log($(`#${name}`).DataTable)
            $(`#${name}`).DataTable().ajax.reload();
            
        } else {
            alert("Fehler beim Löschen.");
        }
    });
}

tables.forEach(table => {
    var titleElement = document.createElement("h2");
    titleElement.className = "mt-4";
    titleElement.innerText = table.displayName;
    tablesElem.appendChild(titleElement);
    var addButton = document.createElement("button");
    addButton.className = "btn btn-primary";
    addButton.textContent = "Hinzufügen";
    addButton.onclick = function () {
        window.location.href = `/editor.html?table=${table.name}`;
    }
    tablesElem.appendChild(addButton);
    var tableElement = document.createElement("table");
    tableElement.id = table.name;
    tableElement.className = "table table-striped";
    tablesElem.appendChild(tableElement);

    table.model.push({
        title: "Actions",
        data: null,
        render: function (data, type, row) {
            return `<div class="btn-group"><button class="btn btn-secondary" onclick="editRow('${table.name}', '${row._id}')">Edit</button>
                    <button class="btn btn-secondary" onclick="deleteRow('${table.name}', '${row._id}')">Delete</button></div>`;
        }
    });
    
    var dataTable = new DataTable(`#${table.name}`, {
        ajax: {
            url: `/${table.name}`,
            type: "GET",
        },
        columns: table.model
    });
});