import { Committee, Transparency } from '../clients/Transparency'

export async function getCommitteesWithOpenSlots(): Promise<Committee[]> {
  const { committees } = await Transparency.getData()
  return committees.filter((committee) => committee.size > committee.members.length)
}
