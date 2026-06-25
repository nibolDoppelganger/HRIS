import React from "react";

// Mock data for the org chart
const orgData = {
  id: "1",
  name: "Dr. Anwar Abbas",
  position: "Direktur Eksekutif",
  division: "Direksi",
  level: "Level 5",
  children: [
    {
      id: "2",
      name: "Rahmatullah Sidik",
      position: "Kepala Divisi",
      division: "Sekretariat",
      level: "Level 5",
      children: [
        {
          id: "6",
          name: "Siti Fadiyah",
          position: "Manager HR",
          division: "Sekretariat",
          level: "Level 4",
        },
        {
          id: "7",
          name: "Budi Santoso",
          position: "Koordinator IT",
          division: "Sekretariat",
          level: "Level 3",
        }
      ]
    },
    {
      id: "3",
      name: "Siti Nurhaliza",
      position: "Kepala Divisi",
      division: "Keuangan",
      level: "Level 5",
      children: [
        {
          id: "8",
          name: "Andi Wijaya",
          position: "Manager Akuntansi",
          division: "Keuangan",
          level: "Level 4",
        }
      ]
    },
    {
      id: "4",
      name: "Ahmad Faisal",
      position: "Kepala Divisi",
      division: "Fundraising",
      level: "Level 5",
      children: []
    },
    {
      id: "5",
      name: "Dian Pelangi",
      position: "Kepala Divisi",
      division: "Program",
      level: "Level 5",
      children: []
    }
  ]
};

// Recursive node component
const OrgNode: React.FC<{ node: any }> = ({ node }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm shadow-blue-500/5 w-48 relative z-10 hover:shadow-md hover:border-[#0053d0]/50 transition-all cursor-pointer group">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0053d0] flex items-center justify-center font-bold text-sm border border-blue-100 mx-auto mb-2">
          {node.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <div className="text-center">
          <p className="font-bold text-[#0b1c30] text-xs truncate group-hover:text-[#0053d0] transition-colors">{node.name}</p>
          <p className="text-[10px] text-[#737686] mt-0.5 truncate">{node.position}</p>
          <span className="inline-block mt-2 px-2 py-0.5 bg-[#f8f9ff] text-[#434654] rounded text-[9px] font-bold border border-blue-50">
            {node.division}
          </span>
        </div>
      </div>
      
      {node.children && node.children.length > 0 && (
        <div className="relative flex flex-col items-center">
          {/* Vertical line connecting parent to children container */}
          <div className="w-px h-6 bg-blue-200"></div>
          
          {/* Horizontal line for children distribution */}
          {node.children.length > 1 && (
            <div className="relative w-full h-px">
              <div 
                className="absolute top-0 h-px bg-blue-200"
                style={{ 
                  left: `calc(100% / ${node.children.length * 2})`, 
                  right: `calc(100% / ${node.children.length * 2})` 
                }}
              ></div>
            </div>
          )}
          
          {/* Children nodes container */}
          <div className="flex justify-center gap-4">
            {node.children.map((child: any, idx: number) => (
              <div key={child.id} className="relative flex flex-col items-center pt-6">
                {/* Vertical line for each child from horizontal line */}
                {node.children.length > 1 && (
                  <div className="absolute top-0 w-px h-6 bg-blue-200"></div>
                )}
                <OrgNode node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const OrgChartView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-[#0b1c30] tracking-tight">Struktur Organisasi</h2>
          <p className="font-sans text-sm text-[#434654] mt-1">Peta hierarki jabatan dan divisi LAZWaf Al Azhar</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-blue-100 p-2.5 rounded-full text-[#737686] hover:text-[#0b1c30] hover:bg-blue-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">zoom_in</span>
          </button>
          <button className="bg-white border border-blue-100 p-2.5 rounded-full text-[#737686] hover:text-[#0b1c30] hover:bg-blue-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">zoom_out</span>
          </button>
          <button className="bg-white border border-blue-100 px-4 py-2.5 rounded-full text-[#0b1c30] hover:bg-blue-50 transition-colors font-semibold text-xs shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter Divisi
          </button>
        </div>
      </div>

      <div className="bg-[#f8f9ff] rounded-[24px] border border-blue-100/60 shadow-inner p-8 overflow-x-auto min-h-[600px] flex justify-center">
        <div className="py-8">
          <OrgNode node={orgData} />
        </div>
      </div>
    </div>
  );
};
