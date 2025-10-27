enum SubmissionStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
  DUPLICATED = 3,
}

export const getSubmissionStatusLabel = (
  submissionStatus: SubmissionStatus,
) => {
  switch (submissionStatus) {
    case SubmissionStatus.PENDING:
      return "Pending";
    case SubmissionStatus.APPROVED:
      return "Approved";
    case SubmissionStatus.REJECTED:
      return "Rejected";
    case SubmissionStatus.DUPLICATED:
      return "Duplicated";
    default:
      return "Unknown";
  }
};

export const getSubmissionStatusEnums = () => {
  const enums = Object.entries(SubmissionStatus);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getSubmissionStatusLabel(+value),
      });
    }
  }
  return result;
};
export default SubmissionStatus;
