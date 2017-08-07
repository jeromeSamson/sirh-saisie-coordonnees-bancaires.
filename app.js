$(document).ready(function () {
    init();
});

function init() {
    $("#save").on("click", function (e) {
        e.preventDefault();
        save();
    });
    updateBanqueInformation("", "", "");
    getListCollabs();
}

function getListCollabs() {
    $.get("http://localhost:8080/sgp/api/collaborateurs").done(function (data) {
        populateTable(data);
    });
};

function save() {
    $.ajax({
        url: "http://localhost:8080/sgp/api/collaborateurs/" + encodeURIComponent($("#matricule").val()) + "/banque?banque=" + encodeURIComponent($("#banque").val()) + "&bic=" + encodeURIComponent($("#bic").val()) + "&iban=" + $("#iban").val(),
        type: 'PUT',
        success: function (data) {
            alert("Le collaborateur de maticule [" + $("#matricule").val() + "] a été mis à jour");
            init();
        }
    });
};

function populateTable(data) {
    $("#listCollabs > .collab").remove();
    data.forEach(function (element) {
        var line = "<tr class='collab'>";
        line += "<td class='matricule'>" + element.matricule + "</td>";
        line += "<td>" + element.nom + "</td>";
        line += "<td>" + element.prenom + "</td>";
        line += "</tr>";
        $("#listCollabs").append(line);
    }, this);

    selectRowOnTable();
};

function selectRowOnTable() {
    $("#listCollabs > .collab").on("click", function () {
        var matricule = $(this).find(".matricule").text();

        $.get("http://localhost:8080/sgp/api/collaborateurs/" + matricule + "/banque").done(function (collabBankData) {
            updateBanqueInformation(collabBankData, matricule);
        });
    });
};

function updateBanqueInformation(bankData, matricule) {
        $("#banque").val(bankData.banque);
        $("#bic").val(bankData.bic);
        $("#iban").val(bankData.iban);
        $("#matricule").val(matricule);
};