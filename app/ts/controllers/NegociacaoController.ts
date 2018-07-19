import { MensagemView, NegociacoesView } from '../views/index';
import { Negociacao, Negociacoes, NegociacaoParcial } from '../models/index';
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoService, handlerFunction } from '../services/index';
import { imprime } from '../helpers/Utils';

export class NegociacaoController {
    @domInject('#data')
    private _inputData: JQuery;
    @domInject('#quantidade')
    private _inputQuantidade: JQuery;
    @domInject('#valor')
    private _inputValor: JQuery;
    private _negociacoes: Negociacoes = new Negociacoes();
    private _negociacoesView: NegociacoesView = new NegociacoesView('#negociacoesView', true);
    private _mensagemView: MensagemView = new MensagemView('#mensagemView');
    private _service: NegociacaoService = new NegociacaoService();

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle()
    adiciona() {
        let data = new Date(this._inputData.val().replace(/-/g, ','));
        if (this._ehDiaUtil(data)) {
            this._mensagemView.update('Somente negociações em dias úteis');
            return;
        }
        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );
        imprime(negociacao);
        this._negociacoes.adiciona(negociacao);
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }

    @throttle(500)
    async importaDados() {
        try {
            const negociacoesParaImportar = await this._service.obterNegociacoes(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw new Error(res.statusText);
                }
            });
            const negociacoesImportadas = this._negociacoes.paraArray();
            negociacoesParaImportar
                .filter(n => negociacoesImportadas.some(j => !n.ehIgual(j)))
                .forEach(negociacao => this._negociacoes.adiciona(negociacao));
            this._negociacoesView.update(this._negociacoes);
        } catch (error) {
            this._mensagemView.update(error.message);
        }
    }

    private _ehDiaUtil(data: Date) {
        return (data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo) ? false : true;
    }
}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}