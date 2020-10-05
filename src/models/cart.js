import {HTTP} from "../utils/http";

class CartModel extends HTTP {
    getCartList (uid) {
        return new Promise ((resolve,reject) => {
            this.ajax({
                url:'shopping_cart/getCartList',
                type: 'POST',
                data:{
                    uid
                },
                dataType: 'JSON',
                success (data){
                    resolve(data)
                }
            })
        })
    }

    updateCartNum(id, num){
        return new Promise ((resolve,reject) => {
            this.ajax({
                url:'shopping_cart/updateCartNum',
                type: 'POST',
                data:{
                    id, num
                },
                dataType: 'JSON',
                success (data){
                    resolve(data)
                }
            })
        })
    }

    removeCartItem(id, num){
        return new Promise ((resolve,reject) => {
            this.ajax({
                url:'shopping_cart/removeCartItem',
                type: 'POST',
                data:{
                    id
                },
                dataType: 'JSON',
                success (data){
                    resolve(data)
                }
            })
        })
    }
    purchaseCart(uid, gids){
        return new Promise ((resolve,reject) => {
            this.ajax({
                url:'shopping_cart/purchaseCart',
                type: 'POST',
                data:{
                    uid,
                    gids
                },
                dataType: 'JSON',
                success (data){
                    resolve(data)
                }
            })
        })
    }
}

export { CartModel };