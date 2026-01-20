import { Item } from "../../components";

const Shop = () => {
  return (
    <ul className="shop">
        <li><Item imgSrc="images/buildings/3.png" price={1100} onBuy={() => {}}/></li>
        <li><Item imgSrc="images/buildings/6.png" price={500} onBuy={() => {}}/></li>
        <li><Item imgSrc="images/buildings/2.png" price={235} onBuy={() => {}}/></li>
    </ul>
  )
}
export default Shop;