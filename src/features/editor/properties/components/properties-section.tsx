import type { ReactNode } from 'react';

interface PropertiesSectionProps {
	children: ReactNode;
}

function PropertiesSection({ children }: PropertiesSectionProps): ReactNode {
	return <section className='px-4 xl:px-8'>{children}</section>;
}

PropertiesSection.displayName = 'PropertiesSection';

export type { PropertiesSectionProps };
export default PropertiesSection;
