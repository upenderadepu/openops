import { Pencil } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

import { isNil } from '@openops/shared';

import { useElementSize } from '../lib/use-element-size';

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

type EditableTextProps = {
  value: string | undefined;
  className?: string;
  readonly: boolean;
  onValueChange: (value: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  tooltipContent?: string;
  maxWidth?: number;
  beforeIconSlot?: React.ReactNode;
};

const EditableText = ({
  value: initialValue,
  className = '',
  readonly = false,
  onValueChange,
  containerRef,
  tooltipContent,
  maxWidth,
  beforeIconSlot,
}: EditableTextProps) => {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);

  const [valueOnEditingStarted, setValueOnEditingStarted] = useState('');

  const editableTextRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useElementSize(containerRef);

  const emitChangedValue = useCallback(() => {
    const nodeValue = (editableTextRef.current?.textContent ?? '').trim();
    const shouldUpdateValue =
      nodeValue.length > 0 && nodeValue !== valueOnEditingStarted;

    setValue(shouldUpdateValue ? nodeValue : valueOnEditingStarted);
    if (shouldUpdateValue) {
      onValueChange(nodeValue);
    }
  }, [onValueChange, valueOnEditingStarted]);

  const setSelectionToValue = () => {
    setTimeout(() => {
      if (
        editableTextRef.current &&
        window.getSelection &&
        document.createRange
      ) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(editableTextRef.current);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 1);
  };

  return (
    <div
      onClick={() => {
        if (readonly) return;
        if (!editing) {
          setEditing(true);
          setValueOnEditingStarted(value ? value.trim() : '');
          setSelectionToValue();
        }
      }}
      className="flex gap-2 items-center w-fit"
    >
      {!editing ? (
        <Tooltip>
          <TooltipTrigger
            disabled={readonly || editing || isNil(tooltipContent)}
            asChild
          >
            <div
              onClick={() => {
                if (readonly) return;
                if (!editing) {
                  setEditing(true);
                  setValueOnEditingStarted(value ? value.trim() : '');
                  setSelectionToValue();
                }
              }}
              className="flex gap-2 items-center"
            >
              <div
                ref={editableTextRef}
                key={'viewed'}
                className={`${className} truncate `}
                style={{
                  maxWidth: maxWidth
                    ? `${maxWidth}px`
                    : `${containerWidth - 100}px`,
                }}
                title={
                  editableTextRef.current &&
                  editableTextRef.current.scrollWidth >
                    editableTextRef.current.clientWidth &&
                  value
                    ? value
                    : ''
                }
              >
                {value}
              </div>
              {beforeIconSlot}
              {!editing && !readonly && (
                <Pencil className="h-4 w-4 shrink-0 cursor-pointer" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="font-normal z-50" side="bottom">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      ) : (
        <div
          key={'editable'}
          ref={editableTextRef}
          contentEditable
          suppressContentEditableWarning={true}
          className={`${className}  focus:outline-none break-all`}
          onBlur={() => {
            emitChangedValue();
            setEditing(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setValue(valueOnEditingStarted);
              setEditing(false);
            } else if (event.key === 'Enter') {
              emitChangedValue();
              setEditing(false);
            }
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
};

EditableText.displayName = 'EditableText';
export { EditableText };
