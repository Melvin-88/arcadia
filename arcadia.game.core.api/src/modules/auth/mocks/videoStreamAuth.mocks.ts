export function shouldThrowExceptionNoSession(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockReturnValue(Promise.resolve(null));
}
