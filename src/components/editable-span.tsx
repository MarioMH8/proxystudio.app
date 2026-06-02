import Input from '@components/input';
import type { SpanProperties } from '@components/span';
import Span from '@components/span';
import { cn } from '@shared/cva';
import type { KeyboardEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

interface EditableSpanProperties extends Omit<SpanProperties, 'children' | 'onChange'> {
	ariaLabel: string;
	inputClassName?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	value: string;
}

function EditableSpan({
	ariaLabel,
	asChild,
	className,
	inputClassName,
	onChange,
	placeholder,
	value,
	...properties
}: EditableSpanProperties): ReactNode {
	const [draftValue, setDraftValue] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const inputReference = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!isEditing) {
			return;
		}

		inputReference.current?.focus();
		inputReference.current?.select();
	}, [isEditing]);

	function startEditing(): void {
		setDraftValue(value);
		setIsEditing(true);
	}

	function stopEditing(): void {
		setIsEditing(false);
	}

	function submitValue(): void {
		onChange(draftValue);
		stopEditing();
	}

	function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			submitValue();
		}

		if (event.key === 'Escape') {
			event.preventDefault();
			setDraftValue(value);
			stopEditing();
		}
	}

	return isEditing ? (
		<Span
			asChild
			className={className}
			{...properties}>
			<Input
				aria-label={ariaLabel}
				className={cn(
					'h-auto min-w-0 border-none bg-transparent px-0 py-0 shadow-none rounded-sm outline-hidden focus-visible:ring-0',
					inputClassName
				)}
				name={ariaLabel}
				onBlur={submitValue}
				onChange={event => {
					setDraftValue(event.target.value);
				}}
				onClick={event => {
					event.stopPropagation();
				}}
				onKeyDown={handleInputKeyDown}
				placeholder={placeholder}
				ref={inputReference}
				strength='soft'
				transparent
				value={draftValue}
			/>
		</Span>
	) : (
		<Span
			className={className}
			onDoubleClick={event => {
				event.stopPropagation();
				startEditing();
			}}
			{...properties}>
			{value}
		</Span>
	);
}

EditableSpan.displayName = 'EditableSpan';

export type { EditableSpanProperties };

export default EditableSpan;
