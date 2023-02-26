export function shouldProvideVideoToken(spyTargets: any): void {
    jest.spyOn(spyTargets.siteRepository, 'findOne').mockResolvedValue({ id: 16 });
    jest.spyOn(spyTargets.videoApiService, 'getApiToken').mockResolvedValue('<token>');
}
