import '../css/index.scss';
import Header from '../components/header/index';
import { IndexModel } from '../models/index';
import ListItem from '../components/index/list_item/index';

const header = new Header(),
      indexModel = new IndexModel(),
      listItem = new ListItem();

const App = (doc) => {
    const oContainer = doc.getElementsByClassName('J_container')[0],
          oList = oContainer.getElementsByClassName('J_list')[0];

    const init = () => {
        indexModel.getGoodsList(listItem.tpl).then(res => {
            oList.innerHTML = res;
        });

        oContainer.appendChild(header.tpl('商品列表'));
    }

    init();
}

new App(document);


