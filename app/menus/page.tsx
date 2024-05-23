import MenusClient from "./menusClient";

type Props = {};

export default async function MenuLists({}: Props) {
  return (
    <div className="py-10 px-10">
      <MenusClient />
    </div>
  );
}
