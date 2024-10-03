import {Spacer} from "@nextui-org/react";
import CustomCard from "./CustomCard";


export default function MySpacer() {
  return (
    <div className="space-y-5">
      <CustomCard />
      <Spacer />
      <CustomCard />
      <Spacer />
      <CustomCard />
    </div>
  );
}