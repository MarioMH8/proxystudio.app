import { Settings, SettingsRepository } from '@modules/settings/domain';
import { inject, injectable } from 'inversify';

@injectable()
export class FindSettingsUseCase {
	constructor(
		@inject(SettingsRepository)
		private readonly repository: SettingsRepository
	) {}

	get entityTools(): typeof Settings {
		return Settings;
	}

	async execute(): Promise<Settings> {
		const partial = await this.repository.find();

		return Settings.default(partial);
	}
}
