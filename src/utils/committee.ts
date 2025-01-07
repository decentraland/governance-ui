import { Committee, Transparency } from '../clients/Transparency'

export async function getCommitteesWithOpenSlots(): Promise<Committee[]> {
  const { committees } = await Transparency.getTeams()
  return committees.filter((committee) => committee.size > committee.members.length)
}
