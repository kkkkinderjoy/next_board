import MemberChart from "@/components/admin/chart/memberchart";
import NewMember from "@/components/admin/chart/newmember";
import NewPost from "@/components/admin/chart/newpost";
import OsCom from "@/components/admin/chart/oschart";
import PlatformCom from "@/components/admin/chart/platformchart";
import TotalCount from "@/components/admin/chart/totalcount";
import VisitChart from "@/components/admin/chart/visitchart";




export default async function Admin(){
  return(
    <>
     <TotalCount/>   
     <div className="w-full my-5 flex flex-wrap justify-between">
        <NewMember/>
        <NewPost/>
     </div>
     <div className="w-full my-5 flex flex-wrap justify-between">
      <MemberChart/>
      <VisitChart/>
     </div>
     <div className="w-full my-5 flex flex-wrap justify-between">
      <OsCom/>
      <PlatformCom/>
     </div>
    </>
  )
}