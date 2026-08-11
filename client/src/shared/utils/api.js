
export function extractList(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.items)) return responseData.items;
  return [];
}

export default extractList;
