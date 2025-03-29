import React, { useState, useEffect } from 'react';
import TagInput from '../../components/Input/TagInput';
import DepartmentsInput from '../../components/Input/DepartmentsInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({
  noteData,
  type,
  getAllNotes,
  onClose,
  showToastMessage,
  currentUserId,
}) => {
  const [title, setTitle] = useState(noteData?.title || '');
  const [content, setContent] = useState(noteData?.content || '');
  const [tags, setTags] = useState(noteData?.tags || []);
  const [departments, setDepartments] = useState(noteData?.departments || []);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    console.log("📌 currentUserId:", currentUserId);
    console.log("📌 noteData.userId:", noteData?.userId);
  }, []);

  // ✅ ใช้ useEffect จัดการการซ่อน warning อัตโนมัติ
  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  // ✅ ตรวจสอบว่ามีแผนกซ้ำหรือไม่
  const handleAddDepartment = (newDept) => {
    if (!newDept.dept.trim() || !newDept.term.trim()) {
      setWarning('❌ กรุณากรอกชื่อแผนกและคำที่ใช้เรียก!');
      return;
    }
    if (
      departments.some(
        (dept) => dept.dept.toLowerCase() === newDept.dept.toLowerCase()
      )
    ) {
      setWarning(`❌ แผนก "${newDept.dept}" มีอยู่แล้ว!`);
      return;
    }

    setWarning(null);
    setDepartments((prevDepartments) => [...prevDepartments, newDept]);
  };

  // ✅ ฟังก์ชันลบแผนก
  const handleRemoveDepartment = (deptToRemove) => {
    setDepartments((prevDepartments) =>
      prevDepartments.filter((dept) => dept.dept !== deptToRemove)
    );
  };

  // ✅ ฟังก์ชันบันทึกข้อมูล
  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError('กรุณากรอก Title และ Content');
      return;
    }

    setError('');

    const formattedDepartments = Array.isArray(departments)
      ? departments.map((dept) => ({
          dept: dept.dept.trim(),
          term: dept.term.trim(),
        }))
      : [];

    const payload = {
      title,
      content,
      tags: tags || [],
      departments: formattedDepartments, // ✅ ตรวจสอบค่า departments
      userId: noteData?.userId || currentUserId,
    };

    console.log('🔥 Payload length:', JSON.stringify(payload).length);
    console.log('📦 Payload preview:', payload);

    try {
      if (type === 'edit') {
        await axiosInstance.put(`/edit-note/${noteData._id}`, payload);
        showToastMessage('Updated Successfully');
      } else {
        await axiosInstance.post('/add-note', payload);
        showToastMessage('Added Successfully');
      }
      await getAllNotes();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      {/* <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div> */}

      <div className="mt-3">
        <label className="input-label">Add Department and Term</label>
        <DepartmentsInput
          departments={departments}
          setDepartments={setDepartments}
        />
      </div>

      {warning && (
        <p className="text-red-500 text-xs pt-4 font-semibold">{warning}</p>
      )}

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleSaveNote}
      >
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  );
};

export default AddEditNotes;
