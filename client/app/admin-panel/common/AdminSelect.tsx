'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import Icon from './AdminIcon';

export type AdminSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

type AdminSelectProps = {
  value: string;
  options: AdminSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  ariaLabel?: string;
};

export default function AdminSelect({
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  className = '',
  ariaLabel,
}: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  function firstEnabledIndex(startIndex: number, direction: 1 | -1 = 1) {
    if (options.length === 0) return -1;

    for (let offset = 0; offset < options.length; offset += 1) {
      const position = startIndex + direction * offset;
      const index = ((position % options.length) + options.length) % options.length;
      if (!options[index].disabled) return index;
    }

    return -1;
  }

  function openMenu(index = selectedIndex) {
    setActiveIndex(index >= 0 && !options[index]?.disabled
      ? index
      : firstEnabledIndex(0));
    setOpen(true);
  }

  function selectOption(option: AdminSelectOption) {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Tab') {
      setOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      if (!open) {
        openMenu(selectedIndex >= 0 ? selectedIndex : direction === 1 ? 0 : options.length - 1);
      } else {
        setActiveIndex(firstEnabledIndex(activeIndex + direction, direction));
      }
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex(event.key === 'Home'
        ? firstEnabledIndex(0)
        : firstEnabledIndex(options.length - 1, -1));
      return;
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!open) {
        openMenu();
      } else if (activeIndex >= 0 && options[activeIndex]) {
        selectOption(options[activeIndex]);
      }
    }
  }

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!(event.target instanceof Node)) return;
      if (controlRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      setOpen(false);
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }

    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const desiredHeight = Math.min(260, options.length * 38 + 10);
      const below = window.innerHeight - rect.bottom - 8;
      const above = rect.top - 8;
      const openAbove = below < Math.min(desiredHeight, 180) && above > below;
      const maxHeight = Math.max(80, Math.min(desiredHeight, openAbove ? above : below));
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8));

      setMenuPosition({
        top: openAbove ? Math.max(8, rect.top - maxHeight - 6) : rect.bottom + 6,
        left,
        width: rect.width,
        maxHeight,
      });
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, listboxId, open]);

  return (
    <div ref={controlRef} className="admin-select-control">
      <button
        ref={triggerRef}
        type="button"
        className={`admin-select-trigger ${className}${selectedOption ? '' : ' is-placeholder'}`}
        role="combobox"
        aria-label={ariaLabel}
        aria-required={required}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => open ? setOpen(false) : openMenu()}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <Icon name="chevron" size={16} />
      </button>
      {open && menuPosition && createPortal(
        <div
          ref={menuRef}
          id={listboxId}
          className="admin-select-menu"
          role="listbox"
          aria-label={ariaLabel ?? placeholder}
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            width: menuPosition.width,
            maxHeight: menuPosition.maxHeight,
          }}
        >
          {options.map((option, index) => (
            <button
              key={`${option.value}-${index}`}
              id={`${listboxId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className={[
                'admin-select-option',
                index === activeIndex ? 'is-active' : '',
                option.value === value ? 'is-selected' : '',
              ].filter(Boolean).join(' ')}
              disabled={option.disabled}
              tabIndex={-1}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectOption(option)}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}
