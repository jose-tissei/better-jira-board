// ==UserScript==
// @name         Jira Tunado
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       José Tissei <z.94@live.com>
// @match        https://jira.hbsis.com.br/secure/RapidBoard.jspa?rapidView=10664
// @match        https://jira.hbsis.com.br/secure/RapidBoard.jspa?rapidView=10761*
// @match        https://jira.hbsis.com.br/secure/RapidBoard.jspa?rapidView=10761
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://raw.githubusercontent.com/js-cookie/js-cookie/master/src/js.cookie.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){

        function zToggleFullScreen() {
            if(Cookies.get('fullscreen') === 'false') {
                Cookies.set('fullscreen', true);
            } else {
                Cookies.set('fullscreen', false);
            }

            location.reload();
        };

$('#ghx-view-presentation').html($('#ghx-view-presentation').html() + `<button class="aui-button">
    Full Screen
</button>`);

        $('#ghx-view-presentation button').last().click(zToggleFullScreen);

        if (Cookies.get('fullscreen') === 'false') {
            return;
        }

        $('.aui-header').remove();
        $('.aui-sidebar-wrapper').remove();
        $('#gh').css({'padding-left':'0px'});
        $('#ghx-pool').css({'padding-top':'0px'});
        $('#ghx-operations').remove();
        $('#ghx-column-header-group').attr('style', '');
        $('.ghx-column-headers .ghx-column h2').css({'font-size':'25px'});
        var historiasComSubTarefas = $('.ghx-swimlane').filter((index, value) => $(value).children('div[data-issue-id]').length != 0);
        var board = $('.ghx-swimlane').filter((index, value) => $(value).children('div[data-issue-id]').length == 0).find('.ghx-column');
        var colunas = {};
        colunas['Não Iniciado'] = board.get(0);
        colunas['Para Fazer'] = board.get(0);
        colunas['Aguardando Dev'] = board.get(0);
        colunas['Impedimento'] = board.get(4);
        colunas['Em análise'] = board.get(0);
        colunas['Em aprovação'] = board.get(0);
        colunas['Aguardando Validação'] = board.get(5);
        colunas['Homologado'] = board.get(5);
        colunas['Em Progresso'] = board.get(1);
                colunas['Em progresso'] = board.get(1);
        colunas['Aguardando Testes'] = board.get(2);
        colunas['Em Testes'] = board.get(3);
        colunas['Em piloto'] = board.get(5);
        colunas['Cancelled'] = board.get(4);
        colunas['Concluída'] = board.get(5);
        historiasComSubTarefas.each((index, value) => $(value).addClass('ghx-closed'));

        historiasComSubTarefas.each((index, value) => {
            var historia = $(value);
            var id = historia.find('.ghx-swimlane-header').attr('data-issue-id');
            var numeroHistoria = historia.find('.ghx-swimlane-avatar').attr('title');
            var status = historia.find('.jira-issue-status-lozenge').text();
            var subTarefas = historia.find('.ghx-info .ghx-description').text();
            var avatar = historia.find('.ghx-avatar img').attr('src');
            $(historia.find('.ghx-summary').first().children()).remove();
            var descricao = historia.find('.ghx-summary').first().text();

            var card = `<div class="js-detailview ghx-issue js-issue ghx-has-avatar js-parent-drag ghx-type-10200 ghx-selected" data-issue-id="`+id+`" data-issue-key="`+numeroHistoria+`" role="listitem" tabindex="0" aria-label="`+numeroHistoria+`">
   <div class="ghx-issue-content">
      <div class="ghx-issue-fields">
         <span class="ghx-type" title="Tarefa"><img src="https://jira.hbsis.com.br/secure/viewavatar?size=xsmall&avatarId=10435&avatarType=issuetype"></span>
         <div class="ghx-key"><a href="/browse/`+numeroHistoria+`" title="`+numeroHistoria+`" tabindex="-1" class="js-key-link">`+numeroHistoria+`</a></div>
         <div class="ghx-summary" title="`+descricao+`"><span class="ghx-inner">`+descricao+`</span></div>
      </div>
      <div class="ghx-highlighted-fields">
         <div class="ghx-highlighted-field"><span class="aui-label ghx-label-8" title="`+subTarefas+`">`+subTarefas+`</span></div>
      </div>
   </div>
   <div class="ghx-avatar"><img src="`+avatar+`" class="ghx-avatar-img"></div>
   <div class="ghx-flags"><span class="ghx-priority" title="?"><img src="https://cdn3.iconfinder.com/data/icons/school-and-education-13/32/question_mark_ask_sign-512.png"></span></div>
   <div class="ghx-grabber ghx-grabber-transparent"></div>
   <div class="ghx-move-count"><b></b></div>
</div>`
          colunas[status].innerHTML += card;

        });

        historiasComSubTarefas.each((index, value) =>  {
             $(value).remove();
        });
        $($('.ghx-swimlane').filter((index, value) => $(value).children('div[data-issue-id]').length == 0).find('.ghx-swimlane-header')).remove();

        $('.ghx-column-headers .ghx-column h2').each((index, value) => {
            value.innerHTML += `<span class="aui-label ghx-label-4">`+$(board.get(index)).find('.js-detailview').length+`</span>`
        });
        $('.ghx-column-headers .ghx-column h2 span').css({'font-size':'20px', 'margin-left':'10px'});
    });
})();