import { Settings, SettingsRepository } from '@modules/settings/domain';
import { inject, injectable } from 'inversify';

@injectable()
export class SaveSettingsUseCase {
	constructor(
		@inject(SettingsRepository)
		private readonly repository: SettingsRepository
	) {}

	async execute(settings: Settings): Promise<void> {
		await this.repository.upsert(settings);
	}
}
