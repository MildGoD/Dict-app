import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

const DepartmentsInput = ({ departments, setDepartments }) => {
  const [deptName, setDeptName] = useState('');
  const [deptTerm, setDeptTerm] = useState('');
  const [warning, setWarning] = useState(null);

  // ✅ ฟังก์ชันเพิ่มแผนก
  const addDepartment = () => {
    if (!deptName.trim() || !deptTerm.trim()) {
      setWarning('❌ Please enter both department name and term!');
      setTimeout(() => setWarning(null), 3000);
      return;
    }

    if (departments.some((dept) => dept.dept.toLowerCase() === deptName.toLowerCase())) {
      setWarning(`❌ Department "${deptName}" already exists`);
      setTimeout(() => setWarning(null), 3000);
      return;
    }

    const newDept = { dept: deptName.trim(), term: deptTerm.trim() };
    setDepartments([...departments, newDept]);
    setDeptName('');
    setDeptTerm('');
    setWarning(null);
  };

  // ✅ ฟังก์ชันลบแผนก
  const removeDepartment = (deptToRemove) => {
    setDepartments(departments.filter((dept) => dept.dept !== deptToRemove));
  };

  return (
    <div>
      {/* แสดงรายการแผนก */}
      {departments.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {departments.map((dept, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded"
            >
              {dept.dept}: {dept.term}
              <button onClick={() => removeDepartment(dept.dept)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* กล่อง input สำหรับเพิ่มแผนก */}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={deptName}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Department name"
          onChange={(e) => setDeptName(e.target.value)}
        />
        <input
          type="text"
          value={deptTerm}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Associated term"
          onChange={(e) => setDeptTerm(e.target.value)}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-red-700 hover:bg-red-700"
          onClick={addDepartment}
        >
          <MdAdd className="text-2xl text-red-700 hover:text-white" />
        </button>
      </div>

      {warning && <p className="text-yellow-500 text-xs pt-2">{warning}</p>}
    </div>
  );
};

export default DepartmentsInput;
