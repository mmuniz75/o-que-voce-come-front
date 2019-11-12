$(document).ready(function(){
    $("#cadastroAlimentoModal").on('shown.bs.modal', function(){
        $(this).find('#foodInput').focus();
    });

    $("#cadastroMarcaModal").on('shown.bs.modal', function(){
        $(this).find('#brandInput').focus();
    });
    
});
