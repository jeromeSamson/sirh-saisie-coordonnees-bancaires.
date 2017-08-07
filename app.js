$(document).ready(function () {
    init();
    initEvent();
});

function initEvent(){
    $('select').on('change', function() {
  getListCollabs(this.value);
})
}
function init() {
    $("#save").on("click", function (e) {
        e.preventDefault();
        save();
    });
    updateBanqueInformation("", "", "");
    getListCollabs(0);
    getListDepartement();
}

function getListCollabs(dep) {
    if(dep==0){
         $.get("http://localhost:8080/sgp/api/collaborateurs").done(function (data) {
        populateTable(data);
    });
     }else{
         $.get("http://localhost:8080/sgp/api/collaborateurs?departement="+dep).done(function (data) {
        populateTable(data);
    });
     }
   
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
        $("tr").css({"background-color":"white"});
        $("tr").css({"color":"black"})
        $(this).css({"background-color":"blue"});
        $(this).css({"color":"white"});
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

function getListDepartement(){
     $.getJSON("http://localhost:8080/sgp/api/departements").done(function (data) {
        populateSelect(data);
    });
};

function populateSelect(data){
    $("#departements").find("option").slice(1).remove();
    data.forEach(function(dep){
         var deptAsOpt = "<option value='" + dep.id + "'>" + dep.nom + "</option>";
    $("#departements").append(deptAsOpt);
    },this)
}; 