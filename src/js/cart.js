import '../css/cart.scss';
import Header from '../components/header/index';
import { CartModel } from '../models/cart';
import ListItem from '../components/cart/list_item/index';
import PurchaseBox from '../components/cart/purchase_box/index';
import NoListTip from '../components/cart/no_listTip/index';
import Toast from '../components/toast/index';


const header = new Header(),
        cartModel = new CartModel(),
        listItem = new ListItem(),
        purchaseBox = new PurchaseBox(),
        noListTip = new NoListTip(),
        toast = new Toast();

const doms = {
    oMainCheck:null,
    oEditBtn:null,
    oPurchaseBtn:null,
    oSubChecks:null,
    oTotal:null,
    oPurchaseBox:null
}

const App = (doc) => {
    const oContainer = doc.getElementsByClassName('J_container')[0],
        oList = oContainer.getElementsByClassName('J_list')[0];

        
    //保存购物车数据
    let cartInfos = {
        list:[],
        total:0
    }

    const init = () =>{
        oContainer.appendChild(header.tpl('购物车',true));
        cartModel.getCartList(1).then(res => {
            cartInfos.list = res.res;
            cartInfos.total = res.total_price;

            if(res.res){
                oList.innerHTML = listItem.makeList(cartInfos.list);
                oContainer.appendChild(purchaseBox.tpl(cartInfos.total));
            }else{
                oList.innerHTML = noListTip.tpl();
            }
                
            
            
        }).then(()=>{
            bindEvent();
        });
    }

    const bindEvent = () => {
            doms.oMainCheck = doc.getElementsByClassName('J_mainCheck')[0];
            doms.oEditBtn = doc.getElementsByClassName('J_editItem')[0];
            doms.oPurchaseBtn = doc.getElementsByClassName('J_purchaseBtn')[0];
            doms.oSubChecks = doc.getElementsByClassName('J_subCheck');
            doms.oTotal = oContainer.getElementsByClassName('J_totalPrice')[0];
            doms.oPurchaseBox = doc.getElementsByClassName('purchase-box')[0];
              
        doms.oMainCheck&&doms.oMainCheck.addEventListener('click',onMainCheck,false);
        oList.addEventListener('click',listEvent,false);
        doms.oEditBtn.addEventListener('click',header.onEditBtn,false);
        doms.oPurchaseBtn&&doms.oPurchaseBtn.addEventListener('click',purchaseCart,false);
        
    }

    const listEvent = (e) =>{
        
        listItem.listEvent(e).then(res => {
            if(res != -1){
                
                
                let item = cartInfos.list[res.idx];
                
                switch (res.field) {
                    case 'numSelector':
                        numOeration(item,res,doms.oTotal);
                        break;
                    case 'checkBox':
                        itemCheck(item,res,doms.oTotal);
                        break;
                    case 'remove':
                        removeItem(res.id);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    const numOeration = (item,data)=>{
        
        item.num = data.num;
        item.total_price = data.num * item.price;
        doms.oSubChecks[data.idx].checked = true;
        cartInfos.list[data.idx].checked = true;
        reComputeTotal();
    }

    const onMainCheck = () =>{
        Array.from(doms.oSubChecks).forEach((elem,index)=>{
            elem.checked = doms.oMainCheck.checked;
            cartInfos.list[index].checked = doms.oMainCheck.checked;
        })

        reComputeTotal(!doms.oMainCheck.checked && true);
    }

    const itemCheck = (item,data)=> {
        item.checked = data.checked;
        
        reComputeTotal()
    }

    const removeItem = (id) => {
        const list = cartInfos.list;

        for(let i = 0;i < list.length ; i++){
            const item = list[i];

            if(item.id === id) {
                const idx = list.indexOf(item);
                cartInfos.list.splice(idx,1);
                break;
            }
        }

        if(cartInfos.list.length > 0){
            reComputeTotal();
        }else{
            
            doms.oPurchaseBox.remove();
            oList.innerHTML = noListTip.tpl();
        }
        
    }

    const reComputeTotal = (doZero) => {
        cartInfos.total = 0;

        if(doZero){
            doms.oTotal.innerHTML = 0;
            return;
        }
        cartInfos.list.forEach(elem=>{
            if(elem.checked){
                
                cartInfos.total += Number(elem.total_price);
            }
        })

        doms.oTotal.innerHTML = cartInfos.total;
    }

    const purchaseCart = () => {
        let gids= [];

        cartInfos.list.forEach(elem => {
            if(elem.checked) {
                gids.push(elem.id)
            }
        })

        cartModel.purchaseCart(1,gids.toString()).then(res =>{
            const code = res.msg_code;
                  
            if(code === '200'){
                toast.showToast({
                    icon:'success',
                    title:'支付成功',
                    duration:1500
                });

                gids.forEach(val =>{
                    cartInfos.list.forEach((elem,idx) => {
                        if(elem.id == val) {
                            cartInfos.list.splice(idx,1);
                        }
                    })
                })

                if(cartInfos.list.length > 0){
                    oList.innerHTML = listItem.makeList(cartInfos.list);
                    doms.oMainCheck.checked = true;
                    reComputeTotal();
                }else{
                    oList.innerHTML = noListTip.tpl();
                    doms.oPurChaseBox.remove()
                }

            }else{
                toast.showToast({
                    icon:'warning',
                    title:'支付失败',
                    duration:1500
                })
            }
        });
    }

    init();

}

new App(document)