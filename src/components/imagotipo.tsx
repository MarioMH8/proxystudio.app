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

const IMAGOTIPO_CONTENT = (
	<Fragment>
		<Isotipo
			alt=''
			aria-hidden='true'
		/>
		<Logotipo />
	</Fragment>
);

type ImagotipoProperties = PropertiesWithAsChild<ComponentPropsWithRef<'div'> & VariantProperties<typeof variants>>;

function Imagotipo({ asChild = false, children, className, ...properties }: ImagotipoProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'div';

	if (asChild && isValidElement(children)) {
		return (
			<Comp
				className={cn(
					focus({ variant: 'primary' }),
					flexBoxClassName({ items: 'center' }),
					variants({ className }),
					className
				)}
				{...properties}>
				{cloneElement(children, {}, IMAGOTIPO_CONTENT)}
			</Comp>
		);
	}

	return (
		<Comp
			className={cn(
				focus({ variant: 'primary' }),
				flexBoxClassName({ items: 'center' }),
				variants({ className }),
				className
			)}
			{...properties}>
			{IMAGOTIPO_CONTENT}
		</Comp>
	);
}

Imagotipo.displayName = 'Imagotipo';

export type { ImagotipoProperties };

export default Imagotipo;
