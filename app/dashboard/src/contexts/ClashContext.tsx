import { fetch } from "service/http";
import { create } from "zustand";
import { useDashboard } from "./DashboardContext";

export type Setting = {
  name: string;
  content: string;
};

export type ProxyTag = {
  tag: string;
  servers: string[];
};

export type ProxyInbound = {
  name: string;
  server: string;
  type: "trojan" | "vless" | "vmess" | "shadowsocks";
  security: string;
  network: string;
  servername: string;
  port: string;
};

export type ProxySettings = {
  icon?: string; // used in range ports
  hidden?: boolean; // hidden in builtin groups
  trojan?: {
    security: "none" | "tls"; // | "reality";
    fingerprint: string;
    udp?: boolean;
    alpn: string;
    sni: string;
    allow_insecure?: boolean;
  };
  vless?: {
    security: "none" | "tls"; // | "reality";
    fingerprint: string;
    servername: string;
    alpn: string;
    udp: boolean;
    allow_insecure: boolean;
  };
  vmess?: {
    security: "none" | "tls"; // | "reality";
    fingerprint: string;
    allow_insecure: boolean;
    servername: string;
    alpn: string;
    udp: boolean;
    ws_opts_path?: string;
    ws_opts_host?: string;
  };
  shadowsocks?: {
    udp: boolean;
  };
};

export type Proxy = {
  id?: number;
  name: string;
  server: string;
  inbound: string;
  tag?: string;
  port: string;
  settings: ProxySettings;
};

export type ProxyBrief = Pick<Proxy, "name" | "server" | "tag"> & {
  id: string;
};

export type ProxyFilter = {
  search?: string;
  limit?: number;
  offset?: number;
  sort: string;
};

export type ProxyGroupSettings = {
  icon?: string;
  hidden?: boolean; // hidden in proxy list(clashx meta only)
  relay?: {};
  url_test?: {
    tolerance: number;
    lazy: boolean;
    url: string;
    interval: number;
  };
  fallback?: {
    url: string;
    interval: number;
  };
  load_balance?: {
    strategy: string;
    url: string;
    interval: number;
  };
  select?: {
    disable_udp: boolean;
    filter: string;
  };
};

export type ProxyGroup = {
  id?: number;
  name: string;
  tag: string;
  type: string;
  builtin: boolean;
  proxies: string;
  settings: ProxyGroupSettings;
};

export type ProxyGroupFilter = {
  search?: string;
  limit?: number;
  offset?: number;
  sort: string;
};

export type Link = {
  id?: number;
  name: string;
  tag: string;
  prefix: string;
  url: string;
  modified_at: string;
};

export type LinkFilter = {
  search?: string;
  limit?: number;
  offset?: number;
  sort: string;
};

export type Rule = {
  id?: number;
  type: string;
  content: string;
  option: string;
  policy: string;
  priority: number;
  ruleset: string;
};

export type RuleFilter = {
  search?: string;
  limit?: number;
  offset?: number;
  ruleset?: string;
  sort: string;
};

export type Ruleset = {
  id?: number;
  name: string;
  builtin?: boolean;
  policy: string;
  settings: {
    icon?: string;
    as_provider?: boolean;
    behavior?: "domain" | "ipcidr" | "classical";
    type?: "http" | "file";
    url?: string;
    path?: string;
    format?: "yaml" | "text";
    interval?: number;
  };
};

export type Alert = {
  title: string;
  content: string;
  type: "error" | "success" | "warning" | "info";
  yes: string;
  onConfirm: () => void;
};

export type SubscriptionStore = {
  loading: boolean;

  sublink: string | null;
  setSublink: (sublink: string | null) => void;

  // delete modal
  alert: Alert | null | undefined;
  onAlert: (del: Alert | null) => void;

  settings: Setting[];
  editingSetting: Setting | null | undefined;
  onEditingSetting: (setting: Setting | null) => void;
  fetchSettings: () => Promise<void>;
  editSetting: (body: Setting) => Promise<void>;

  // get rules or rulesets
  rules: Rule[];
  totalRules: number;
  rulesets: Ruleset[];
  ruleFilter: RuleFilter;
  fetchRules: () => Promise<void>;
  fetchRulesets: () => Promise<void>;
  onRuleFilterChange: (filter: Partial<RuleFilter>) => void;

  // edit or create rule
  isCreatingRule: boolean;
  editingRule: Rule | null | undefined;
  onCreateRule: (isOpen: boolean) => void;
  onEditingRule: (rule: Rule | null) => void;
  createRule: (body: Rule) => Promise<void>;
  editRule: (body: Rule) => Promise<void>;
  deleteRule: (body: Rule) => Promise<void>;

  // edit or create ruleset
  isCreatingRuleset: boolean;
  editingRuleset: Ruleset | null | undefined;
  onCreateRuleset: (isOpen: boolean) => void;
  onEditingRuleset: (rule: Ruleset | null) => void;
  createRuleset: (body: Ruleset) => Promise<void>;
  editRuleset: (body: Ruleset) => Promise<void>;
  deleteRuleset: (body: Ruleset) => Promise<void>;

  proxyTags: ProxyTag[];
  proxyInbounds: ProxyInbound[];
  proxyBriefs: ProxyBrief[];
  proxies: Proxy[];
  totalProxies: number;
  proxyFilter: ProxyFilter;
  fetchProxies: () => Promise<void>;
  fetchProxyTags: () => Promise<void>;
  fetchProxyInbounds: () => Promise<void>;
  fetchProxyBriefs: () => Promise<void>;
  onProxyFilterChange: (filter: Partial<ProxyFilter>) => void;
  isCreatingProxy: boolean;
  editingProxy: Proxy | null | undefined;
  duplicatingProxy: Proxy | null | undefined;
  onCreateProxy: (isOpen: boolean) => void;
  onEditingProxy: (proxy: Proxy | null) => void;
  onDuplicatingProxy: (proxy: Proxy | null) => void;
  createProxy: (body: Proxy) => Promise<void>;
  editProxy: (body: Proxy) => Promise<void>;
  deleteProxy: (body: Proxy) => Promise<void>;

  proxyGroups: ProxyGroup[];
  totalProxyGroups: number;
  proxyGroupFilter: ProxyGroupFilter;
  fetchProxyGroups: () => Promise<void>;
  onProxyGroupFilterChange: (filter: Partial<ProxyGroupFilter>) => void;
  isCreatingProxyGroup: boolean;
  editingProxyGroup: ProxyGroup | null | undefined;
  duplicatingProxyGroup: ProxyGroup | null | undefined;
  onCreateProxyGroup: (isOpen: boolean) => void;
  onEditingProxyGroup: (proxyGroup: ProxyGroup | null) => void;
  onDuplicatingProxyGroup: (proxyGroup: ProxyGroup | null) => void;
  createProxyGroup: (body: ProxyGroup) => Promise<void>;
  editProxyGroup: (body: ProxyGroup) => Promise<void>;
  deleteProxyGroup: (body: ProxyGroup) => Promise<void>;

  links: Link[];
  totalLinks: number;
  linkFilter: LinkFilter;
  fetchLinks: () => Promise<void>;
  onLinkFilterChange: (filter: Partial<LinkFilter>) => void;
  isCreatingLink: boolean;
  editingLink: Link | null | undefined;
  onCreateLink: (isOpen: boolean) => void;
  onEditingLink: (link: Link | null) => void;
  createLink: (body: Link) => Promise<void>;
  editLink: (body: Link) => Promise<void>;
  deleteLink: (body: Link) => Promise<void>;
};

export const useClash = create<SubscriptionStore>((set, get) => ({
  loading: false,

  sublink: null,
  setSublink: (sublink) => set({ sublink }),

  settings: [],
  editingSetting: null,
  onEditingSetting: (setting) => set({ editingSetting: setting }),
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`/clash/settings`);
      set({ settings: response.data });
      return response.data;
    } finally {
      set({ loading: false });
    }
  },
  editSetting: async (body) => {
    await fetch(`/clash/setting/${body.name}`, { method: "PUT", body });
    set({ editingSetting: null });
    get().fetchSettings();
  },

  alert: null,
  onAlert: (alert) => set({ alert }),

  rules: [],
  totalRules: 0,
  rulesets: [],
  ruleFilter: { value: "", sort: "-modified_at", limit: 10 },
  fetchRules: async () => {
    const query = get().ruleFilter;
    for (const key in query) {
      if (!query[key as keyof RuleFilter])
        delete query[key as keyof RuleFilter];
    }
    set({ loading: true });
    try {
      const response = await fetch("/clash/rules", { query });
      set({ rules: response.data, totalRules: response.total });
      return response.data;
    } finally {
      set({ loading: false });
    }
  },
  fetchRulesets: async () => {
    const response = await fetch("/clash/rulesets");
    useClash.setState({ rulesets: response.data });
    return response.data;
  },
  onRuleFilterChange: (filter) => {
    set({
      ruleFilter: {
        ...get().ruleFilter,
        ...filter,
      },
    });
    get().fetchRules();
  },

  isCreatingRule: false,
  editingRule: null,
  onCreateRule: (isCreatingRule) => set({ isCreatingRule }),
  onEditingRule: (editingRule) => set({ editingRule }),
  createRule: async (body: Rule) => {
    await fetch(`/clash/rule`, { method: "POST", body });
    set({ editingRule: null });
    get().fetchRules();
  },
  editRule: async (body: Rule) => {
    await fetch(`/clash/rule/${body.id}`, { method: "PUT", body });
    set({ editingRule: null });
    get().fetchRules();
  },
  deleteRule: async (body: Rule) => {
    await fetch(`/clash/rule/${body.id}`, { method: "DELETE" });
    set({ editingRule: null });
    get().fetchRules();
  },

  isCreatingRuleset: false,
  editingRuleset: null,
  onCreateRuleset: (isCreatingRuleset) => set({ isCreatingRuleset }),
  onEditingRuleset: (editingRuleset) => set({ editingRuleset }),
  createRuleset: async (body: Ruleset) => {
    await fetch(`/clash/ruleset`, { method: "POST", body });
    set({ editingRuleset: null });
    get().fetchRulesets();
  },
  editRuleset: async (body: Ruleset) => {
    await fetch(`/clash/ruleset/${body.id}`, { method: "PUT", body });
    set({ editingRuleset: null });
    get().fetchRulesets();
  },
  deleteRuleset: async (body: Ruleset) => {
    await fetch(`/clash/ruleset/${body.id}`, { method: "DELETE" });
    set({ editingRuleset: null });
    get().ruleFilter.ruleset = "";
    get().fetchRulesets();
    get().fetchRules();
  },

  proxyTags: [],
  proxyInbounds: [],
  proxyBriefs: [],
  proxies: [],
  totalProxies: 0,
  proxyFilter: { search: "", sort: "id", limit: 10 },
  fetchProxies: async () => {
    const query = get().proxyFilter;
    for (const key in query) {
      if (!query[key as keyof ProxyFilter])
        delete query[key as keyof ProxyFilter];
    }
    set({ loading: true });
    try {
      const response = await fetch("/clash/proxies", { query });
      set({ proxies: response.data, totalProxies: response.total });
      return response.data;
    } finally {
      set({ loading: false });
    }
  },
  fetchProxyTags: async () => {
    const response = await fetch("/clash/proxy/tags");
    set({ proxyTags: response.data });
    return response.data;
  },
  fetchProxyInbounds: async () => {
    const response = await fetch("/clash/proxy/inbounds");
    set({ proxyInbounds: response.data });
    return response.data;
  },
  fetchProxyBriefs: async () => {
    const response = await fetch("/clash/proxy/briefs");
    set({ proxyBriefs: response.data });
    return response.data;
  },
  onProxyFilterChange: (filter) => {
    set({
      proxyFilter: {
        ...get().proxyFilter,
        ...filter,
      },
    });
    get().fetchProxies();
  },
  isCreatingProxy: false,
  editingProxy: null,
  duplicatingProxy: null,
  onCreateProxy: (isCreatingProxy) => set({ isCreatingProxy }),
  onEditingProxy: (editingProxy) => set({ editingProxy }),
  onDuplicatingProxy: (duplicatingProxy) => {
    if (duplicatingProxy) {
      get().onEditingProxy(null);
      set({ duplicatingProxy });
      get().onCreateProxy(true);
    } else {
      set({ duplicatingProxy });
    }
  },
  createProxy: async (body: Proxy) => {
    await fetch(`/clash/proxy`, { method: "POST", body });
    set({ editingProxy: null });
    get().fetchProxyBriefs();
    get().fetchProxyTags();
    get().fetchProxies();
  },
  editProxy: async (body: Proxy) => {
    await fetch(`/clash/proxy/${body.id}`, { method: "PUT", body });
    useDashboard.getState().refetchUsers();
    set({ editingProxy: null });
    get().fetchProxyBriefs();
    get().fetchProxyTags();
    get().fetchProxies();
  },
  deleteProxy: async (body: Proxy) => {
    await fetch(`/clash/proxy/${body.id}`, { method: "DELETE" });
    set({ editingProxy: null });
    useDashboard.getState().refetchUsers();
    get().fetchProxyBriefs();
    get().fetchProxyTags();
    get().fetchProxies();
  },

  proxyGroups: [],
  totalProxyGroups: 0,
  proxyGroupFilter: { search: "", sort: "id", limit: 10 },
  fetchProxyGroups: async () => {
    const query = get().proxyGroupFilter;
    for (const key in query) {
      if (!query[key as keyof ProxyGroupFilter])
        delete query[key as keyof ProxyGroupFilter];
    }
    set({ loading: true });
    try {
      const response = await fetch("/clash/proxy/groups", { query });
      set({ proxyGroups: response.data, totalProxyGroups: response.total });
      return response.data;
    } finally {
      set({ loading: false });
    }
  },
  onProxyGroupFilterChange: (filter) => {
    set({
      proxyGroupFilter: {
        ...get().proxyGroupFilter,
        ...filter,
      },
    });
    get().fetchProxyGroups();
  },
  isCreatingProxyGroup: false,
  editingProxyGroup: null,
  duplicatingProxyGroup: null,
  onCreateProxyGroup: (isCreatingProxyGroup) => set({ isCreatingProxyGroup }),
  onEditingProxyGroup: (editingProxyGroup) => set({ editingProxyGroup }),
  onDuplicatingProxyGroup: (duplicatingProxyGroup) => {
    if (duplicatingProxyGroup) {
      get().onEditingProxyGroup(null);
      set({ duplicatingProxyGroup });
      get().onCreateProxyGroup(true);
    } else {
      set({ duplicatingProxyGroup });
    }
  },
  createProxyGroup: async (body: ProxyGroup) => {
    await fetch(`/clash/proxy/group`, { method: "POST", body });
    set({ editingProxyGroup: null });
    get().fetchProxyTags();
    get().fetchProxyGroups();
    get().fetchProxyBriefs();
  },
  editProxyGroup: async (body: ProxyGroup) => {
    await fetch(`/clash/proxy/group/${body.id}`, { method: "PUT", body });
    useDashboard.getState().refetchUsers();
    set({ editingProxyGroup: null });
    get().fetchProxyTags();
    get().fetchProxyGroups();
    get().fetchProxyBriefs();
  },
  deleteProxyGroup: async (body: ProxyGroup) => {
    await fetch(`/clash/proxy/group/${body.id}`, { method: "DELETE" });
    const editingProxyGroup = get().editingProxyGroup;
    if (editingProxyGroup?.tag) {
      useDashboard.getState().refetchUsers();
    }
    set({ editingProxyGroup: null });
    get().fetchProxyTags();
    get().fetchProxyGroups();
    get().fetchProxyBriefs();
  },

  links: [],
  totalLinks: 0,
  linkFilter: { search: "", sort: "id", limit: 10 },
  fetchLinks: async () => {
    const query = get().linkFilter;
    for (const key in query) {
      if (!query[key as keyof LinkFilter])
        delete query[key as keyof LinkFilter];
    }
    set({ loading: true });
    try {
      const response = await fetch("/clash/links", { query });
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const links = (response.data as Link[]).map((link) => ({
        ...link,
        modified_at: new Date(link.modified_at + 'Z').toLocaleString(
          "zh-CN",
          options
        ),
      }));
      set({ links: links, totalLinks: response.total });
      return response.data;
    } finally {
      set({ loading: false });
    }
  },
  onLinkFilterChange: (filter) => {
    set({
      linkFilter: {
        ...get().linkFilter,
        ...filter,
      },
    });
    get().fetchLinks();
  },
  isCreatingLink: false,
  editingLink: null,
  onCreateLink: (isCreatingLink) => set({ isCreatingLink }),
  onEditingLink: (editingLink) => set({ editingLink }),
  createLink: async (body: Link) => {
    await fetch(`/clash/link`, { method: "POST", body });
    set({ editingLink: null });
    get().fetchLinks();
    get().fetchProxyTags();
  },
  editLink: async (body: Link) => {
    await fetch(`/clash/link/${body.id}`, { method: "PUT", body });
    set({ editingLink: null });
    get().fetchLinks();
    get().fetchProxyTags();
    useDashboard.getState().refetchUsers();
  },
  deleteLink: async (body: Link) => {
    await fetch(`/clash/link/${body.id}`, { method: "DELETE" });
    set({ editingLink: null });
    get().fetchLinks();
    get().fetchProxyTags();
    useDashboard.getState().refetchUsers();
  },
}));
