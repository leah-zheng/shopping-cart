import './index.scss';
import tpl from './index.tpl';
import CheckBox from '../check_box/index';

const checkBox = new CheckBox();

export default () => {
    return {
        name:'purchaseBox',
        tpl(price){
            let html = tpl().replace(/{{(.*?)}}/g,(node,key)=>{
                return{
                    price,
                    check_box:checkBox.tpl(0, 'mainCheck')
                }[key]
            });

            let oBox = document.createElement('div');
            oBox.className = 'purchase-box';
            oBox.innerHTML = html;

            return oBox;
        },

        onMainCheck(total) {
            const oSubChecks = Array.from(document.getElementsByClassName('J_subCheck')),
                oMainCheck = document.getElementsByClassName('J_mainCheck')[0],
                oTotal = document.getElementsByClassName('J_totalPrice')[0];

            oSubChecks.forEach(elem => {
                elem.checked = oMainCheck.checked;
            })

            oTotal.innerHTML = oMainCheck.checked ? total : 0;
        }
    }
}