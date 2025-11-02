//
// script.js
// Contém o JavaScript e jQuery para todas as interações da aplicação
//

$(document).ready(function() {
    
    const htmlElement = $('html');
    
    // =======================================================
    // 0. LÓGICA DE TEMA (APLICADA NA INICIALIZAÇÃO)
    // =======================================================

    const loadTheme = () => {
        const savedTheme = localStorage.getItem('appTheme');
        if (savedTheme === 'dark') {
            htmlElement.attr('data-bs-theme', 'dark');
        } else {
            htmlElement.removeAttr('data-bs-theme');
        }
    };
    
    loadTheme();
    
    if (localStorage.getItem('compactView') === 'true') {
        $('body').addClass('compact-view');
    }


    // =======================================================
    // 1. AÇÕES DA TELA DE LOGIN (index.html)
    // =======================================================
    if ($('#loginForm').length) {
        
        $('#loginForm').on('submit', function(e) {
            e.preventDefault(); 

            const email = $('#email').val();
            const senha = $('#senha').val();
            const feedback = $('#feedbackMessage');
            
            const validEmail = 'admin@clinica.com';
            const validSenha = 'admin123';

            feedback.removeClass().addClass('alert mt-3 d-none').text('');

            if (email === validEmail && senha === validSenha) {
                feedback.addClass('alert-success').removeClass('d-none').text('Login bem-sucedido! Redirecionando...');
                
                setTimeout(function() {
                    window.location.href = 'dashboard.html'; 
                }, 1500);

            } else {
                feedback.addClass('alert-danger').removeClass('d-none').text('Credenciais inválidas. Verifique seu e-mail e senha.');
            }
        });

        $('#forgotPassword').on('click', function(e) {
            e.preventDefault();
            alert('Ação de recuperação de senha simulada.');
        });
    }

    // =======================================================
    // 2. AÇÕES DE NAVEGAÇÃO DO MENU LATERAL
    // =======================================================
    
    $('#nav-menu a').on('click', function(e) {
        
        const pageName = $(this).data('page');
        
        if ($(this).attr('href') === '#') {
            e.preventDefault();
            
            if (pageName && pageName !== 'dashboard') {
                alert(`Simulação de Navegação: Você clicou em "${pageName}". A tela de CRUD correspondente seria carregada aqui.`);
            }
        }
        
        if ($('#nav-menu').length) {
            $('#nav-menu a').removeClass('active');
            $(this).addClass('active');
        }
    });


    // =======================================================
    // 3. AÇÕES DA TELA DE CONSULTAS (consultas.html)
    // =======================================================
    if ($('#consultas-tabs').length) {
        
        // 3.1 Lógica de Filtragem de Abas
        $('#consultas-tabs button').on('click', function() {
            const filter = $(this).attr('aria-controls'); 
            const tableRows = $('#todas tbody tr');
            
            if (filter === 'todas') {
                tableRows.show();
            } else {
                tableRows.hide();
                tableRows.filter('[data-status="' + filter + '"]').show(); 
            }
        });

        // Lógica de Envio do Modal de Novo Agendamento
        $('#agendamentoForm').on('submit', function(e) {
            e.preventDefault();
            const paciente = $('#pacienteSelect option:selected').text();
            alert(`Consulta Agendada com Sucesso!\nPaciente: ${paciente} (Simulação)`);
            $('#novaConsultaModal').modal('hide');
            $(this)[0].reset();
        });

        // Lógica de Envio do Modal de Edição
        $('#edicaoConsultaForm').on('submit', function(e) {
            e.preventDefault();
            alert('Consulta Editada com Sucesso! (Simulação)');
            $('#editarConsultaModal').modal('hide');
        });

        // Lógica DINÂMICA: Preencher o Modal de Cancelamento antes de abrir
        $('#cancelarConsultaModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget); 
            const row = button.closest('tr'); 

            const paciente = row.find('td:eq(1)').text().trim(); 
            const horaCompleta = row.find('td:eq(0)').text().trim().replace(/(\r\n|\n|\r)/gm, ' '); 
            const hora = horaCompleta.match(/\d{2}:\d{2}/) ? horaCompleta.match(/\d{2}:\d{2}/)[0] : "Hora Indefinida";


            $('#cancelamento-details').html(`**${paciente}** (${hora})`);
            
            const consultaId = row.data('consulta-id');
            $('#confirmarCancelamento').data('target-id', consultaId);
        });

        // Lógica de Confirmação de Cancelamento (COM SIMULAÇÃO DE MOVIMENTAÇÃO)
        $('#confirmarCancelamento').on('click', function() {
            const consultaId = $(this).data('target-id');
            const targetRow = $('tr[data-consulta-id="' + consultaId + '"]');

            alert('Consulta Cancelada com Sucesso! (Simulação)');

            targetRow.attr('data-status', 'canceladas');

            const statusCell = targetRow.find('td:eq(4)');
            statusCell.html('<span class="badge bg-danger-subtle text-danger fw-normal">Cancelada</span>');

            const activeTab = $('#consultas-tabs .active').attr('aria-controls');
            if (activeTab !== 'todas' && activeTab !== 'canceladas') {
                targetRow.hide();
            }

            $('#cancelarConsultaModal').modal('hide');
        });
        
    }


    // =======================================================
    // 4. AÇÕES DA TELA DE PACIENTES (pacientes.html)
    // =======================================================
    if ($('#pacientesTableBody').length) {
        
        // 4.1 Lógica de Busca na Tabela
        $('#searchInput').on('keyup', function() {
            const searchText = $(this).val().toLowerCase();
            $('#pacientesTableBody tr').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(searchText) > -1);
            });
        });

        // 4.2 Lógica de Envio do Modal de Novo Paciente
        $('#novoPacienteForm').on('submit', function(e) {
            e.preventDefault();
            const nome = $('#nomeCompleto').val();
            alert(`Paciente Salvo com Sucesso!\nNome: ${nome} (Simulação)`);
            $('#novoPacienteModal').modal('hide');
            $(this)[0].reset();
        });

        // 4.3 Lógica de Edição: Preencher o Modal antes de abrir
        $('#editarPacienteModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget); 
            const row = button.closest('tr'); 
            
            const nome = row.find('td:eq(0)').text().split('\n')[0].trim().replace('**', '').replace('**', '');
            const idade = row.find('td:eq(1)').text().replace(' anos', '').trim();
            const cpf = "111.222.333-44"; // Simulação
            const telefone = row.find('td:eq(2)').text().split('\n')[0].trim().replace('📞', '').trim();
            const statusAtual = row.find('td:eq(4) .badge').text().toLowerCase().includes('ativo') ? 'ativo' : 'inativo';

            const enderecoSimulado = "Rua das Flores, 123, São Paulo - SP"; 
            
            $('#nomeEdit').val(nome);
            $('#idadeEdit').val(idade);
            $('#cpfEdit').val(cpf);
            $('#telefoneEdit').val(telefone);
            $('#enderecoEdit').val(enderecoSimulado);
            $('#statusEdit').val(statusAtual); 

            const pacienteId = row.data('paciente-id');
            $('#edicaoPacienteForm').data('target-id', pacienteId); 
        });

        // 4.4 Lógica de Envio do Modal de Edição (e atualização da linha)
        $('#edicaoPacienteForm').on('submit', function(e) {
            e.preventDefault();
            const targetId = $(this).data('target-id');
            const targetRow = $('tr[data-paciente-id="' + targetId + '"]');
            
            const novoNome = $('#nomeEdit').val();
            const novoTelefone = $('#telefoneEdit').val();
            const novaIdade = $('#idadeEdit').val();
            const novoStatusValue = $('#statusEdit').val();
            const novoStatusText = novoStatusValue.charAt(0).toUpperCase() + novoStatusValue.slice(1);
            const genero = targetRow.find('td:eq(0) .small').text(); 

            targetRow.find('td:eq(0)').html(`**${novoNome}**<br><span class="text-muted small">${genero}</span>`);
            targetRow.find('td:eq(1)').text(`${novaIdade} anos`);
            targetRow.find('td:eq(2)').html(`<i class="bi bi-phone me-1"></i> ${novoTelefone}<br><i class="bi bi-envelope me-1"></i> email@atualizado.com`);
            
            const statusBadge = targetRow.find('td:eq(4) .badge');
            
            statusBadge.text(novoStatusText);
            statusBadge.removeClass('bg-success bg-secondary text-white')
                       .addClass(novoStatusValue === 'ativo' ? 'bg-success text-white' : 'bg-secondary text-white');


            alert(`Paciente ${novoNome} Editado e Status Atualizado para ${novoStatusText} com Sucesso! (Simulação)`);
            $('#editarPacienteModal').modal('hide');
        });


        // 4.5 Lógica de Exclusão: Preencher o Modal antes de abrir
        $('#excluirPacienteModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget); 
            const row = button.closest('tr'); 
            const pacienteNome = row.data('paciente-nome');
            const pacienteId = row.data('paciente-id');

            $('#paciente-nome-excluir').text(pacienteNome);
            $('#confirmarExclusaoPaciente').data('target-id', pacienteId);
        });

        // 4.6 Lógica de Confirmação de Exclusão (e remoção da linha)
        $('#confirmarExclusaoPaciente').on('click', function() {
            const pacienteId = $(this).data('target-id');
            const targetRow = $('tr[data-paciente-id="' + pacienteId + '"]');

            alert(`Paciente ${targetRow.data('paciente-nome')} Excluído com Sucesso! (Simulação)`);

            targetRow.remove();

            $('#excluirPacienteModal').modal('hide');
        });
        
        // 4.7 Simulação de Ação do Botão "Histórico"
        $('.btn-historico-paciente').on('click', function() {
            const row = $(this).closest('tr');
            const pacienteNome = row.data('paciente-nome');
            const pacienteId = row.data('paciente-id');
            
            alert(`Simulação: Você seria redirecionado para a tela de Histórico do paciente ${pacienteNome} (ID: ${pacienteId}).`);
        });

    }

    // =======================================================
    // 5. AÇÕES DA TELA DE MÉDICOS (medicos.html) - NOVO
    // =======================================================
    if ($('#medicosGrid').length) {
        
        // Função utilitária para pegar o elemento card mais próximo
        const getCard = (element) => $(element).closest('.col');

        // 5.1 Lógica de Envio do Modal de Novo Médico
        $('#novoMedicoForm').on('submit', function(e) {
            e.preventDefault();
            const nome = $('#medicoNomeCompleto').val();
            const especialidade = $('#medicoEspecialidade').val();
            alert(`Médico Salvo com Sucesso!\nNome: ${nome}\nEspecialidade: ${especialidade} (Simulação)`);
            $('#novoMedicoModal').modal('hide');
            $(this)[0].reset();
        });

        // 5.2 Simulação de Ver Agenda
        $('.btn-ver-agenda').on('click', function() {
            const card = getCard(this);
            const nome = card.data('medico-nome');
            const agenda = card.data('horario');
            alert(`Simulação de Agenda:\nAgenda de ${nome}: ${agenda}.\nVocê seria redirecionado para o calendário detalhado.`);
        });

        // 5.3 Lógica de Edição: Preencher o Modal antes de abrir
        $('#editarMedicoModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget); 
            const card = getCard(button); 
            
            // Pega os dados do card
            const id = card.data('medico-id');
            const nome = card.data('medico-nome');
            const especialidade = card.data('especialidade');
            const crm = card.data('crm');
            const telefone = card.data('telefone');
            const horario = card.data('horario');
            const emailSimulado = nome.toLowerCase().replace(/[^a-z0-9]/g, '.') + "@clinica.com";

            // Popula os campos do Modal
            $('#medicoIdEdit').val(id);
            $('#medicoNomeEdit').val(nome);
            $('#medicoEspecialidadeEdit').val(especialidade);
            $('#medicoCRMEdit').val(crm);
            $('#medicoTelefoneEdit').val(telefone);
            $('#medicoEmailEdit').val(emailSimulado);
            $('#medicoHorarioEdit').val(horario);
            
            $('#edicaoMedicoForm').data('target-id', id);
        });

        // 5.4 Lógica de Envio do Modal de Edição (e atualização do card)
        $('#edicaoMedicoForm').on('submit', function(e) {
            e.preventDefault();
            const targetId = $(this).data('target-id');
            const targetCard = $('div[data-medico-id="' + targetId + '"]');
            
            // Pega os novos valores
            const novoNome = $('#medicoNomeEdit').val();
            const novaEspecialidade = $('#medicoEspecialidadeEdit').val();
            const novoTelefone = $('#medicoTelefoneEdit').val();
            const novoHorario = $('#medicoHorarioEdit').val();

            // Atualiza os dados do card (DOM e data attributes)
            targetCard.find('.card-body h5.fw-bold').text(novoNome);
            targetCard.find('.card-body p.small:eq(0)').text(novaEspecialidade);
            targetCard.find('.card-body ul li:eq(0)').html(`<i class="bi bi-phone me-2"></i> ${novoTelefone}`);
            targetCard.find('.card-body ul li:eq(2)').html(`<i class="bi bi-clock me-2"></i> ${novoHorario}`);

            // Atualiza data attributes para futuras edições
            targetCard.data('medico-nome', novoNome);
            targetCard.data('especialidade', novaEspecialidade);
            targetCard.data('telefone', novoTelefone);
            targetCard.data('horario', novoHorario);

            alert(`Médico ${novoNome} Editado com Sucesso! (Simulação)`);
            $('#editarMedicoModal').modal('hide');
        });

        // 5.5 Lógica de Exclusão: Preencher o Modal antes de abrir
        $('#excluirMedicoModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget); 
            const card = getCard(button); 
            const medicoNome = card.data('medico-nome');
            const medicoId = card.data('medico-id');

            $('#medico-nome-excluir').text(medicoNome);
            $('#confirmarExclusaoMedico').data('target-id', medicoId);
        });

        // 5.6 Lógica de Confirmação de Exclusão (e remoção do card)
        $('#confirmarExclusaoMedico').on('click', function() {
            const medicoId = $(this).data('target-id');
            const targetCard = $('div[data-medico-id="' + medicoId + '"]');

            alert(`Médico ${targetCard.data('medico-nome')} Excluído com Sucesso! (Simulação)`);

            // Remove o card da grade
            targetCard.remove();

            $('#excluirMedicoModal').modal('hide');
        });
    }


    // =======================================================
    // 6. AÇÕES DA TELA DE CONFIGURAÇÕES (configuracoes.html)
    // =======================================================
    if ($('#infoClinicaForm').length) {
        
        // Submissão: Informações da Clínica
        $('#infoClinicaForm').on('submit', function(e) {
            e.preventDefault();
            alert('Informações da Clínica salvas com sucesso!');
        });

        // Submissão: Segurança (Alterar Senha)
        $('#segurancaForm').on('submit', function(e) {
            e.preventDefault();
            const novaSenha = $('#novaSenha').val();
            const confirmarSenha = $('#confirmarSenha').val();

            if (novaSenha !== confirmarSenha) {
                alert('Erro: A Nova Senha e a Confirmação de Senha não conferem.');
            } else {
                alert('Senha alterada com sucesso! (Simulação)');
            }
        });
        
        // Alternância do Modo Escuro (DarkModeSwitch)
        $('#darkModeSwitch').on('change', function() {
            if ($(this).is(':checked')) {
                htmlElement.attr('data-bs-theme', 'dark');
                localStorage.setItem('appTheme', 'dark');
            } else {
                htmlElement.removeAttr('data-bs-theme');
                localStorage.setItem('appTheme', 'light');
            }
            location.reload(); 
        });

        if (localStorage.getItem('appTheme') === 'dark') {
            $('#darkModeSwitch').prop('checked', true);
        }

        // Alternância da Visualização Compacta
        $('#compactViewSwitch').on('change', function() {
            if ($(this).is(':checked')) {
                $('body').addClass('compact-view');
                localStorage.setItem('compactView', 'true');
                alert('Visualização Compacta Ativada! (Requer CSS extra para efeito visual)');
            } else {
                $('body').removeClass('compact-view');
                localStorage.setItem('compactView', 'false');
                alert('Visualização Padrão Ativada!');
            }
        });
    }

});