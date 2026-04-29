import { flexBoxClassName } from '@components/flex-box';
import focus from '@components/focus';
import Isotipo from '@components/isotipo';
import Logotipo from '@components/logotipo';
import rounded from '@components/rounded';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cloneElement, Fragment, isValidElement } from 'react';

const variants = cva({
	base: cn('gap-2', rounded()),
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type ImagotipoProperties = PropertiesWithAsChild<ComponentPropsWithRef<'div'> & VariantProperties<typeof variants>>;

function Imagotipo({ asChild = false, children, className, ...properties }: ImagotipoProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'div';

	const content = (
		<Fragment>
			<Isotipo
				alt=''
				aria-hidden='true'
			/>
			<Logotipo />
		</Fragment>
	);

	if (asChild && isValidElement(children)) {
		return (
			<Comp
				className={cn(focus({ variant: 'primary' }), flexBoxClassName({}), variants({ className }), className)}
				{...properties}>
				{cloneElement(children, {}, content)}
			</Comp>
		);
	}

	return (
		<Comp
			className={cn(focus({ variant: 'primary' }), flexBoxClassName({}), variants({ className }), className)}
			{...properties}>
			{content}
		</Comp>
	);
}

Imagotipo.displayName = 'Imagotipo';

export type { ImagotipoProperties };

export { variants };

export default Imagotipo;
