export const findBmIdsToUpdate = async (groupid: number, catid: number) => {
  const query = `
    select bm.id from bookmarks bm
      inner join bookmarkingroup bmig on bm.id = bmig.bookmarkid
      inner join bookmarkincategory bmic on bm.id = bmic.bookmarkid
      where bmig.groupid = ${groupid} and bmic.categoryid = ${catid}
  `;
  return query;
};
