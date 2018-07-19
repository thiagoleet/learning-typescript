import { View } from './View';
import { Negociacoes } from '../models/Negociacoes';

export class NegociacoesView extends View<Negociacoes> {

    template(model: Negociacoes): string {
        return `
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>QUANTIDADE</th>
                        <th>VALOR</th>
                        <th>VOLUME</th>
                    </tr>
                </thead>
                <tbody>
                ${model.paraArray().map(negociacao => `
                 <tr>
                 <td>${this.converteData(negociacao.data)}</td>
                 <td>${negociacao.quantidade}</td>
                 <td>${negociacao.valor}</td>
                 <td>${negociacao.volume}</td>
                 </tr>
                 `).join()}
                </tbody>
                <tfoot>
                </tfoot>
            </table>
            `;
    }

    private converteData(data: Date): string {
        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    }
}