import axios from "axios";

export default class Update {
  account: string;
  repo: string;

  constructor(options?: { account: string; repo: string }) {
    let _options = options || { account: "", repo: "" };

    this.account = _options.account || "einaraglen";
    this.repo = _options.repo || "label-printer";
  }

  getReleases(): Promise<GithubResponse> {
    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return axios
      .get(`https://api.github.com/repos/${this.account}/${this.repo}/releases/latest`)
      .then((response: any) => handleResponse(response))
      .catch((error: any) => handleErrorResponse(error));
  }
}

interface GithubResponse {
  data: any;
  status: number;
}

const handleResponse = (response: any): GithubResponse => {
  return {
    data: response.data,
    status: response.status,
  };
};

export const handleErrorResponse = (error: any): GithubResponse => {
  try {
    if (error.response) return { data: error.response.data, status: error.response.status };
    if (error.request) return { data: error.request, status: 500 };
    return { data: error.message, status: 500 };
  } catch (err: any) {
    return { data: err, status: 500 };
  }
};
