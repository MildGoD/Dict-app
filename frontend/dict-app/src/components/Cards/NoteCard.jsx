import moment from 'moment';
import React from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          {/* <span className="text-xs text-slate-500">
            {moment(date).format('Do MMM YYYY')}
          </span> */}
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2 whitespace-pre-wrap line-clamp-2">
        {content}
      </p>

      {/* ✅ แสดง Departments แทน Tags */}
      {Array.isArray(tags) && tags.length > 0 && tags[0] !== '' ? (
        (() => {
          const visibleTags = tags.slice(0, 2);
          const remainingCount = tags.length - visibleTags.length;
          const fullText = tags
            .map((tag) =>
              typeof tag === 'object' && tag.dept && tag.term
                ? `#${tag.dept}: ${tag.term}`
                : `#${tag}`
            )
            .join(' ');

          return (
            <div
              className="text-xs text-slate-500 mt-2 overflow-hidden whitespace-nowrap text-ellipsis"
              style={{ maxWidth: '100%' }}
              title={fullText}
            >
              {visibleTags.map((tag, index) => (
                <span key={index} className="mr-2">
                  {typeof tag === 'object' && tag.dept && tag.term
                    ? `#${tag.dept}: ${tag.term}`
                    : `#${tag}`}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-slate-400">
                  ... +{remainingCount} more
                </span>
              )}
            </div>
          );
        })()
      ) : (
        <div className="text-xs text-slate-500 mt-2">
          <span>No department data</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
        <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
      </div>
    </div>
  );
};

export default NoteCard;
