"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var badge_1 = require("@/components/ui/badge");
var tabs_1 = require("@/components/ui/tabs");
var textarea_1 = require("@/components/ui/textarea");
var table_1 = require("@/components/ui/table");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var dialog_1 = require("@/components/ui/dialog");
var sonner_1 = require("sonner");
var utils_1 = require("@/lib/utils");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var store_1 = require("@/lib/store");
var lucide_react_1 = require("lucide-react");
function AdminPage() {
    var _this = this;
    var _a = (0, react_1.useState)(false), isLoggedIn = _a[0], setIsLoggedIn = _a[1];
    var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)('overview'), activeTab = _c[0], setActiveTab = _c[1];
    // Data
    var _d = (0, react_1.useState)([]), cardKeys = _d[0], setCardKeys = _d[1];
    var _e = (0, react_1.useState)([]), announcements = _e[0], setAnnouncements = _e[1];
    var _f = (0, react_1.useState)(''), searchQuery = _f[0], setSearchQuery = _f[1];
    // SMTP
    var _g = (0, react_1.useState)((0, store_1.getSmtpConfig)()), smtpConfig = _g[0], setSmtpConfig = _g[1];
    var _h = (0, react_1.useState)(false), testingSmtp = _h[0], setTestingSmtp = _h[1];
    var _j = (0, react_1.useState)(null), smtpTestResult = _j[0], setSmtpTestResult = _j[1];
    // Single add
    var _k = (0, react_1.useState)(''), newCode = _k[0], setNewCode = _k[1];
    var _l = (0, react_1.useState)(''), newNote = _l[0], setNewNote = _l[1];
    // Batch add
    var _m = (0, react_1.useState)(false), showBatchDialog = _m[0], setShowBatchDialog = _m[1];
    var _o = (0, react_1.useState)(''), batchCodes = _o[0], setBatchCodes = _o[1];
    var _p = (0, react_1.useState)(''), batchNote = _p[0], setBatchNote = _p[1];
    // Announcement
    var _q = (0, react_1.useState)(false), showAnnounceDialog = _q[0], setShowAnnounceDialog = _q[1];
    var _r = (0, react_1.useState)(null), editingAnnouncement = _r[0], setEditingAnnouncement = _r[1];
    var _s = (0, react_1.useState)(''), announceTitle = _s[0], setAnnounceTitle = _s[1];
    var _t = (0, react_1.useState)(''), announceContent = _t[0], setAnnounceContent = _t[1];
    var _u = (0, react_1.useState)('medium'), announcePriority = _u[0], setAnnouncePriority = _u[1];
    // Dialogs
    var _v = (0, react_1.useState)(null), showDeleteConfirm = _v[0], setShowDeleteConfirm = _v[1];
    var _w = (0, react_1.useState)(false), showPasswordDialog = _w[0], setShowPasswordDialog = _w[1];
    var _x = (0, react_1.useState)(''), newPassword = _x[0], setNewPassword = _x[1];
    var _y = (0, react_1.useState)(false), showPasswordText = _y[0], setShowPasswordText = _y[1];
    (0, react_1.useEffect)(function () {
        if (isLoggedIn)
            refreshData();
    }, [isLoggedIn]);
    var refreshData = function () {
        setCardKeys((0, store_1.getCardKeys)());
        setAnnouncements((0, store_1.getAnnouncements)());
        setSmtpConfig((0, store_1.getSmtpConfig)());
    };
    var handleSaveSmtp = function () {
        (0, store_1.updateSmtpConfig)(smtpConfig);
        sonner_1.toast.success('SMTP 配置已保存');
        refreshData();
    };
    var handleTestSmtp = function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!smtpConfig.host || !smtpConfig.username || !smtpConfig.password || !smtpConfig.fromEmail) {
                        sonner_1.toast.error('请填写完整的 SMTP 配置信息');
                        return [2 /*return*/];
                    }
                    // Save config first
                    (0, store_1.updateSmtpConfig)(smtpConfig);
                    setTestingSmtp(true);
                    setSmtpTestResult(null);
                    return [4 /*yield*/, (0, store_1.testSmtpConfig)()];
                case 1:
                    result = _a.sent();
                    setTestingSmtp(false);
                    if (result.success) {
                        setSmtpTestResult({ success: true, message: 'SMTP 连接成功！测试邮件已发送到你的邮箱' });
                        sonner_1.toast.success('SMTP 测试成功');
                    }
                    else {
                        setSmtpTestResult({ success: false, message: result.error || '测试失败，请检查配置' });
                        sonner_1.toast.error(result.error || '测试失败');
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleLogin = function () {
        if ((0, store_1.verifyAdmin)(password)) {
            setIsLoggedIn(true);
            sonner_1.toast.success('登录成功');
        }
        else {
            sonner_1.toast.error('密码错误');
        }
    };
    var handleLogout = function () {
        setIsLoggedIn(false);
        setPassword('');
        sonner_1.toast.info('已退出登录');
    };
    // 添加单张卡密
    var handleAddSingleKey = function () {
        if (!newCode.trim()) {
            sonner_1.toast.error('请输入卡密');
            return;
        }
        var result = (0, store_1.addCardKey)(newCode.trim(), newNote.trim() || undefined);
        if (result) {
            sonner_1.toast.success('卡密添加成功');
            setNewCode('');
            setNewNote('');
            refreshData();
        }
        else {
            sonner_1.toast.error('该卡密已存在');
        }
    };
    // 批量添加卡密
    var handleBatchAdd = function () {
        if (!batchCodes.trim()) {
            sonner_1.toast.error('请输入卡密');
            return;
        }
        var result = (0, store_1.batchAddCardKeys)(batchCodes, batchNote.trim() || undefined);
        if (result.success > 0) {
            sonner_1.toast.success("\u6210\u529F\u6DFB\u52A0 ".concat(result.success, " \u5F20\u5361\u5BC6").concat(result.failed > 0 ? "\uFF0C".concat(result.failed, " \u5F20\u91CD\u590D\u6216\u65E0\u6548") : ''));
        }
        else {
            sonner_1.toast.error('所有卡密都已存在或格式无效');
        }
        setBatchCodes('');
        setBatchNote('');
        setShowBatchDialog(false);
        refreshData();
    };
    var handleSaveAnnouncement = function () {
        if (!announceTitle.trim() || !announceContent.trim()) {
            sonner_1.toast.error('请填写完整信息');
            return;
        }
        if (editingAnnouncement) {
            (0, store_1.updateAnnouncement)(editingAnnouncement.id, {
                title: announceTitle,
                content: announceContent,
                priority: announcePriority,
            });
            sonner_1.toast.success('公告已更新');
        }
        else {
            (0, store_1.addAnnouncement)({
                title: announceTitle,
                content: announceContent,
                priority: announcePriority,
                isActive: true,
            });
            sonner_1.toast.success('公告已发布');
        }
        setShowAnnounceDialog(false);
        setEditingAnnouncement(null);
        setAnnounceTitle('');
        setAnnounceContent('');
        setAnnouncePriority('medium');
        refreshData();
    };
    var handleEditAnnouncement = function (a) {
        setEditingAnnouncement(a);
        setAnnounceTitle(a.title);
        setAnnounceContent(a.content);
        setAnnouncePriority(a.priority);
        setShowAnnounceDialog(true);
    };
    var handleDeleteAnnouncement = function (id) {
        (0, store_1.deleteAnnouncement)(id);
        refreshData();
        setShowDeleteConfirm(null);
        sonner_1.toast.success('公告已删除');
    };
    var handleDeleteKey = function (id) {
        (0, store_1.deleteCardKey)(id);
        refreshData();
        setShowDeleteConfirm(null);
        sonner_1.toast.success('卡密已删除');
    };
    var handleResetKey = function (id) {
        (0, store_1.resetCardKey)(id);
        refreshData();
        sonner_1.toast.success('卡密已重置为未使用状态');
    };
    var handleChangePassword = function () {
        if (newPassword.length < 4) {
            sonner_1.toast.error('密码至少4个字符');
            return;
        }
        (0, store_1.changeAdminPassword)(newPassword);
        setShowPasswordDialog(false);
        setNewPassword('');
        sonner_1.toast.success('密码已修改');
    };
    var filteredKeys = cardKeys.filter(function (k) {
        var _a, _b;
        return k.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ((_a = k.claimedBy) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase())) ||
            ((_b = k.note) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    var stats = {
        total: cardKeys.length,
        unused: cardKeys.filter(function (k) { return k.status === 'unused'; }).length,
        used: cardKeys.filter(function (k) { return k.status === 'used'; }).length,
    };
    // ─── Login Screen ───
    if (!isLoggedIn) {
        return (React.createElement("div", { className: "min-h-screen grid-bg flex items-center justify-center px-4" },
            React.createElement(card_1.Card, { className: "glass-card border-border/30 w-full max-w-md animate-scale-in" },
                React.createElement(card_1.CardHeader, { className: "text-center" },
                    React.createElement("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 glow-cyan" },
                        React.createElement(lucide_react_1.Shield, { className: "w-8 h-8 text-primary" })),
                    React.createElement(card_1.CardTitle, { className: "text-2xl" }, "\u540E\u53F0\u7BA1\u7406\u767B\u5F55"),
                    React.createElement(card_1.CardDescription, null, "\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u7801\u4EE5\u7EE7\u7EED")),
                React.createElement(card_1.CardContent, { className: "space-y-4" },
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement(label_1.Label, { htmlFor: "admin-password" }, "\u7BA1\u7406\u5458\u5BC6\u7801"),
                        React.createElement("div", { className: "relative" },
                            React.createElement(input_1.Input, { id: "admin-password", type: showPasswordText ? 'text' : 'password', placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801", value: password, onChange: function (e) { return setPassword(e.target.value); }, onKeyDown: function (e) { return e.key === 'Enter' && handleLogin(); }, className: "pr-10 bg-secondary/50 border-border/50 focus:border-primary/50 h-12" }),
                            React.createElement("button", { type: "button", onClick: function () { return setShowPasswordText(!showPasswordText); }, className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" }, showPasswordText ? React.createElement(lucide_react_1.EyeOff, { className: "w-4 h-4" }) : React.createElement(lucide_react_1.Eye, { className: "w-4 h-4" })))),
                    React.createElement(button_1.Button, { onClick: handleLogin, className: "w-full gap-2 glow-cyan hover:glow-cyan h-12" },
                        React.createElement(lucide_react_1.Lock, { className: "w-4 h-4" }),
                        "\u767B\u5F55"),
                    React.createElement("p", { className: "text-xs text-muted-foreground text-center" }, "\u9ED8\u8BA4\u5BC6\u7801: admin123")))));
    }
    // ─── Admin Dashboard ───
    return (React.createElement("div", { className: "min-h-screen grid-bg pt-24 pb-16 px-4" },
        React.createElement("div", { className: "max-w-6xl mx-auto" },
            React.createElement("div", { className: "flex items-center justify-between mb-8 animate-fade-in-up" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-2xl sm:text-3xl font-bold" },
                        React.createElement("span", { className: "text-gradient-cyan" }, "\u540E\u53F0\u7BA1\u7406")),
                    React.createElement("p", { className: "text-muted-foreground mt-1" }, "\u7BA1\u7406\u5361\u5BC6\u3001\u516C\u544A\u548C\u7CFB\u7EDF\u8BBE\u7F6E")),
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return setShowPasswordDialog(true); }, className: "gap-1 border-border/30" },
                        React.createElement(lucide_react_1.Settings, { className: "w-4 h-4" }),
                        "\u4FEE\u6539\u5BC6\u7801"),
                    React.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: handleLogout, className: "gap-1 border-destructive/30 text-destructive hover:bg-destructive/10" },
                        React.createElement(lucide_react_1.LogOut, { className: "w-4 h-4" }),
                        "\u9000\u51FA"))),
            React.createElement("div", { className: "grid grid-cols-3 gap-4 mb-8" }, [
                { label: '总卡密数', value: stats.total, color: 'text-primary' },
                { label: '未使用', value: stats.unused, color: 'text-yellow-400' },
                { label: '已使用', value: stats.used, color: 'text-green-400' },
            ].map(function (stat, i) { return (React.createElement(card_1.Card, { key: stat.label, className: (0, utils_1.cn)('glass-card border-border/30 animate-fade-in-up', "stagger-".concat(i + 1)) },
                React.createElement(card_1.CardContent, { className: "p-5 text-center" },
                    React.createElement("div", { className: (0, utils_1.cn)('text-3xl font-bold', stat.color) }, stat.value),
                    React.createElement("div", { className: "text-sm text-muted-foreground mt-1" }, stat.label)))); })),
            React.createElement(tabs_1.Tabs, { defaultValue: "overview", onValueChange: setActiveTab },
                React.createElement(tabs_1.TabsList, { className: "grid grid-cols-4 w-full max-w-lg bg-secondary/50 mb-6" },
                    React.createElement(tabs_1.TabsTrigger, { value: "overview", className: "gap-1" },
                        React.createElement(lucide_react_1.BarChart3, { className: "w-4 h-4" }),
                        "\u6982\u89C8"),
                    React.createElement(tabs_1.TabsTrigger, { value: "keys", className: "gap-1" },
                        React.createElement(lucide_react_1.Key, { className: "w-4 h-4" }),
                        "\u5361\u5BC6\u7BA1\u7406"),
                    React.createElement(tabs_1.TabsTrigger, { value: "announcements", className: "gap-1" },
                        React.createElement(lucide_react_1.Megaphone, { className: "w-4 h-4" }),
                        "\u516C\u544A\u7BA1\u7406"),
                    React.createElement(tabs_1.TabsTrigger, { value: "smtp", className: "gap-1" },
                        React.createElement(lucide_react_1.Mail, { className: "w-4 h-4" }),
                        "\u90AE\u4EF6\u8BBE\u7F6E")),
                React.createElement(tabs_1.TabsContent, { value: "overview", className: "animate-fade-in" },
                    React.createElement(card_1.Card, { className: "glass-card border-border/30" },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "\u7CFB\u7EDF\u6982\u89C8"),
                            React.createElement(card_1.CardDescription, null, "\u5F53\u524D\u7CFB\u7EDF\u8FD0\u884C\u72B6\u6001\u548C\u6570\u636E\u7EDF\u8BA1")),
                        React.createElement(card_1.CardContent, { className: "space-y-4" },
                            React.createElement("div", { className: "grid md:grid-cols-2 gap-4" },
                                React.createElement("div", { className: "rounded-xl p-5 bg-secondary/30 border border-border/30" },
                                    React.createElement("h3", { className: "text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2" },
                                        React.createElement(lucide_react_1.Key, { className: "w-4 h-4 text-primary" }),
                                        "\u5361\u5BC6\u7EDF\u8BA1"),
                                    React.createElement("div", { className: "space-y-2 text-sm" },
                                        React.createElement("div", { className: "flex justify-between" },
                                            React.createElement("span", { className: "text-muted-foreground" }, "\u603B\u5361\u5BC6\u6570"),
                                            React.createElement("span", { className: "text-foreground font-medium" }, stats.total)),
                                        React.createElement("div", { className: "flex justify-between" },
                                            React.createElement("span", { className: "text-muted-foreground" }, "\u672A\u4F7F\u7528"),
                                            React.createElement("span", { className: "text-yellow-400 font-medium" }, stats.unused)),
                                        React.createElement("div", { className: "flex justify-between" },
                                            React.createElement("span", { className: "text-muted-foreground" }, "\u5DF2\u4F7F\u7528"),
                                            React.createElement("span", { className: "text-green-400 font-medium" }, stats.used)),
                                        React.createElement("div", { className: "flex justify-between" },
                                            React.createElement("span", { className: "text-muted-foreground" }, "\u6709\u6548\u671F"),
                                            React.createElement(badge_1.Badge, { variant: "outline", className: "text-primary border-primary/30 text-xs" },
                                                React.createElement(lucide_react_1.Infinity, { className: "w-3 h-3 mr-1" }),
                                                "\u6C38\u4E45")))),
                                React.createElement("div", { className: "rounded-xl p-5 bg-secondary/30 border border-border/30" },
                                    React.createElement("h3", { className: "text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2" },
                                        React.createElement(lucide_react_1.Megaphone, { className: "w-4 h-4 text-primary" }),
                                        "\u516C\u544A\u7EDF\u8BA1"),
                                    React.createElement("div", { className: "space-y-2 text-sm" },
                                        React.createElement("div", { className: "flex justify-between" },
                                            React.createElement("span", { className: "text-muted-foreground" }, "\u603B\u516C\u544A\u6570"),
                                            React.createElement("span", { className: "text-foreground font-medium" }, announcements.length)),
                                        React.createElement("div", { className: "flex justify-between" },
                                            React.createElement("span", { className: "text-muted-foreground" }, "\u91CD\u8981\u516C\u544A"),
                                            React.createElement("span", { className: "text-red-400 font-medium" }, announcements.filter(function (a) { return a.priority === 'high'; }).length)),
                                        React.createElement("div", { className: "flex justify-between" },
                                            React.createElement("span", { className: "text-muted-foreground" }, "\u6D3B\u8DC3\u516C\u544A"),
                                            React.createElement("span", { className: "text-green-400 font-medium" }, announcements.filter(function (a) { return a.isActive; }).length)))))))),
                React.createElement(tabs_1.TabsContent, { value: "keys", className: "animate-fade-in space-y-6" },
                    React.createElement(card_1.Card, { className: "glass-card border-border/30" },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, { className: "text-lg flex items-center gap-2" },
                                React.createElement(lucide_react_1.Plus, { className: "w-5 h-5 text-primary" }),
                                "\u6DFB\u52A0\u5361\u5BC6"),
                            React.createElement(card_1.CardDescription, null, "\u624B\u52A8\u8F93\u5165\u5361\u5BC6\u4EE3\u7801\u6DFB\u52A0\u5230\u7CFB\u7EDF\u4E2D\uFF0C\u6240\u6709\u5361\u5BC6\u5747\u4E3A\u6C38\u4E45\u6709\u6548")),
                        React.createElement(card_1.CardContent, null,
                            React.createElement("div", { className: "flex flex-wrap gap-3 items-end" },
                                React.createElement("div", { className: "space-y-2 flex-1 min-w-[200px]" },
                                    React.createElement(label_1.Label, null, "\u5361\u5BC6\u4EE3\u7801"),
                                    React.createElement(input_1.Input, { placeholder: "\u8F93\u5165\u5361\u5BC6\u4EE3\u7801\uFF0C\u5982 VIP-XXXX-XXXX", value: newCode, onChange: function (e) { return setNewCode(e.target.value.toUpperCase()); }, onKeyDown: function (e) { return e.key === 'Enter' && handleAddSingleKey(); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50 font-mono" })),
                                React.createElement("div", { className: "space-y-2 flex-1 min-w-[160px]" },
                                    React.createElement(label_1.Label, null, "\u5907\u6CE8\uFF08\u53EF\u9009\uFF09"),
                                    React.createElement(input_1.Input, { placeholder: "\u5907\u6CE8\u4FE1\u606F", value: newNote, onChange: function (e) { return setNewNote(e.target.value); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50" })),
                                React.createElement(button_1.Button, { onClick: handleAddSingleKey, className: "gap-2 glow-cyan hover:glow-cyan h-10" },
                                    React.createElement(lucide_react_1.Plus, { className: "w-4 h-4" }),
                                    "\u6DFB\u52A0"),
                                React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setShowBatchDialog(true); }, className: "gap-2 border-primary/30 hover:bg-primary/10 h-10" },
                                    React.createElement(lucide_react_1.ListPlus, { className: "w-4 h-4" }),
                                    "\u6279\u91CF\u6DFB\u52A0")))),
                    React.createElement(card_1.Card, { className: "glass-card border-border/30" },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, { className: "text-lg" },
                                "\u5361\u5BC6\u5217\u8868 (",
                                filteredKeys.length,
                                ")")),
                        React.createElement(card_1.CardContent, null,
                            React.createElement("div", { className: "flex items-center gap-2 mb-4" },
                                React.createElement(lucide_react_1.Search, { className: "w-4 h-4 text-muted-foreground" }),
                                React.createElement(input_1.Input, { placeholder: "\u641C\u7D22\u5361\u5BC6\u3001\u90AE\u7BB1\u6216\u5907\u6CE8...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50" })),
                            React.createElement("div", { className: "overflow-x-auto scrollbar-thin rounded-lg border border-border/30" },
                                React.createElement(table_1.Table, null,
                                    React.createElement(table_1.TableHeader, null,
                                        React.createElement(table_1.TableRow, { className: "bg-secondary/50" },
                                            React.createElement(table_1.TableHead, null, "\u5361\u5BC6"),
                                            React.createElement(table_1.TableHead, null, "\u72B6\u6001"),
                                            React.createElement(table_1.TableHead, null, "\u4F7F\u7528\u8005"),
                                            React.createElement(table_1.TableHead, null, "\u5907\u6CE8"),
                                            React.createElement(table_1.TableHead, null, "\u521B\u5EFA\u65F6\u95F4"),
                                            React.createElement(table_1.TableHead, { className: "text-right" }, "\u64CD\u4F5C"))),
                                    React.createElement(table_1.TableBody, null,
                                        filteredKeys.length === 0 && (React.createElement(table_1.TableRow, null,
                                            React.createElement(table_1.TableCell, { colSpan: 6, className: "text-center py-12 text-muted-foreground" }, "\u6682\u65E0\u5361\u5BC6\uFF0C\u8BF7\u5728\u4E0A\u65B9\u6DFB\u52A0"))),
                                        __spreadArray([], filteredKeys, true).reverse().map(function (key) { return (React.createElement(table_1.TableRow, { key: key.id, className: "border-border/20" },
                                            React.createElement(table_1.TableCell, { className: "font-mono text-sm tracking-wider" },
                                                React.createElement("div", { className: "flex items-center gap-2" },
                                                    React.createElement("span", null, key.code),
                                                    React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "w-6 h-6 shrink-0", onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var success;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, (0, utils_1.safeCopyToClipboard)(key.code)];
                                                                    case 1:
                                                                        success = _a.sent();
                                                                        sonner_1.toast[success ? 'success' : 'error'](success ? '已复制' : '复制失败');
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); } },
                                                        React.createElement(lucide_react_1.Copy, { className: "w-3 h-3" })))),
                                            React.createElement(table_1.TableCell, null,
                                                React.createElement(badge_1.Badge, { variant: "outline", className: (0, utils_1.cn)(key.status === 'unused'
                                                        ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                                                        : 'text-green-400 border-green-400/30 bg-green-400/10') }, key.status === 'unused' ? '未使用' : '已使用')),
                                            React.createElement(table_1.TableCell, { className: "text-muted-foreground text-sm" }, key.claimedBy || '-'),
                                            React.createElement(table_1.TableCell, { className: "text-muted-foreground text-sm max-w-[120px] truncate" }, key.note || '-'),
                                            React.createElement(table_1.TableCell, { className: "text-muted-foreground text-sm" }, (0, date_fns_1.format)(new Date(key.createdAt), 'MM-dd HH:mm', { locale: locale_1.zhCN })),
                                            React.createElement(table_1.TableCell, { className: "text-right" },
                                                React.createElement("div", { className: "flex items-center justify-end gap-1" },
                                                    key.status === 'used' && (React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "w-7 h-7 text-blue-400 hover:bg-blue-400/10", onClick: function () { return handleResetKey(key.id); }, title: "\u91CD\u7F6E\u4E3A\u672A\u4F7F\u7528" },
                                                        React.createElement(lucide_react_1.RotateCcw, { className: "w-3.5 h-3.5" }))),
                                                    React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "w-7 h-7 text-destructive hover:bg-destructive/10", onClick: function () { return setShowDeleteConfirm(key.id); } },
                                                        React.createElement(lucide_react_1.Trash2, { className: "w-3.5 h-3.5" })))))); }))))))),
                React.createElement(tabs_1.TabsContent, { value: "announcements", className: "animate-fade-in space-y-6" },
                    React.createElement(card_1.Card, { className: "glass-card border-border/30" },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement("div", { className: "flex items-center justify-between flex-wrap gap-3" },
                                React.createElement("div", null,
                                    React.createElement(card_1.CardTitle, null, "\u516C\u544A\u7BA1\u7406"),
                                    React.createElement(card_1.CardDescription, null, "\u53D1\u5E03\u548C\u7BA1\u7406\u7CFB\u7EDF\u516C\u544A")),
                                React.createElement(button_1.Button, { onClick: function () {
                                        setEditingAnnouncement(null);
                                        setAnnounceTitle('');
                                        setAnnounceContent('');
                                        setAnnouncePriority('medium');
                                        setShowAnnounceDialog(true);
                                    }, className: "gap-2 glow-cyan hover:glow-cyan" },
                                    React.createElement(lucide_react_1.Plus, { className: "w-4 h-4" }),
                                    "\u53D1\u5E03\u516C\u544A"))),
                        React.createElement(card_1.CardContent, null,
                            React.createElement("div", { className: "space-y-3" },
                                announcements.length === 0 && (React.createElement("div", { className: "text-center py-8 text-muted-foreground" }, "\u6682\u65E0\u516C\u544A")),
                                announcements.map(function (a) { return (React.createElement("div", { key: a.id, className: "rounded-xl p-4 bg-secondary/30 border border-border/30 flex items-start gap-3" },
                                    React.createElement("div", { className: "flex-1 min-w-0" },
                                        React.createElement("div", { className: "flex items-center gap-2 mb-1 flex-wrap" },
                                            React.createElement("h4", { className: "font-semibold text-foreground text-sm" }, a.title),
                                            React.createElement(badge_1.Badge, { variant: "outline", className: (0, utils_1.cn)('text-xs', a.priority === 'high' ? 'text-red-400 border-red-400/30' :
                                                    a.priority === 'medium' ? 'text-yellow-400 border-yellow-400/30' :
                                                        'text-blue-400 border-blue-400/30') }, a.priority === 'high' ? '重要' : a.priority === 'medium' ? '一般' : '普通')),
                                        React.createElement("p", { className: "text-xs text-muted-foreground line-clamp-2" }, a.content),
                                        React.createElement("p", { className: "text-xs text-muted-foreground/60 mt-1" }, (0, date_fns_1.format)(new Date(a.createdAt), 'yyyy-MM-dd HH:mm', { locale: locale_1.zhCN }))),
                                    React.createElement("div", { className: "flex items-center gap-1 shrink-0" },
                                        React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "w-7 h-7", onClick: function () { return handleEditAnnouncement(a); } },
                                            React.createElement(lucide_react_1.Edit, { className: "w-3.5 h-3.5" })),
                                        React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "w-7 h-7 text-destructive hover:bg-destructive/10", onClick: function () { return setShowDeleteConfirm("announce-".concat(a.id)); } },
                                            React.createElement(lucide_react_1.Trash2, { className: "w-3.5 h-3.5" }))))); }))))),
                React.createElement(tabs_1.TabsContent, { value: "smtp", className: "animate-fade-in space-y-6" },
                    React.createElement(card_1.Card, { className: "glass-card border-border/30" },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, { className: "flex items-center gap-2" },
                                React.createElement(lucide_react_1.Mail, { className: "w-5 h-5 text-primary" }),
                                "SMTP \u90AE\u4EF6\u8BBE\u7F6E"),
                            React.createElement(card_1.CardDescription, null, "\u914D\u7F6E SMTP \u670D\u52A1\u5668\u4EE5\u53D1\u9001\u90AE\u7BB1\u9A8C\u8BC1\u7801")),
                        React.createElement(card_1.CardContent, { className: "space-y-5" },
                            React.createElement("div", { className: "rounded-xl p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-400/20" },
                                React.createElement("p", { className: "text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1.5" },
                                    React.createElement(lucide_react_1.Code, { className: "w-3.5 h-3.5" }),
                                    "\u542F\u7528\u771F\u5B9E\u90AE\u4EF6\u53D1\u9001\u7684\u6B65\u9AA4"),
                                React.createElement("ol", { className: "text-xs text-muted-foreground space-y-1.5 list-decimal list-inside" },
                                    React.createElement("li", null,
                                        "\u542F\u52A8\u540E\u7AEF\u90AE\u4EF6\u670D\u52A1\uFF1A",
                                        React.createElement("code", { className: "px-1.5 py-0.5 bg-secondary/80 rounded text-cyan-300 text-[11px]" }, "cd server && npm start")),
                                    React.createElement("li", null, "\u5728\u4E0B\u65B9\u586B\u5199 SMTP \u670D\u52A1\u5668\u4FE1\u606F\u5E76\u4FDD\u5B58"),
                                    React.createElement("li", null, "\u70B9\u51FB\u300C\u6D4B\u8BD5\u8FDE\u63A5\u300D\u786E\u8BA4\u914D\u7F6E\u6B63\u786E"),
                                    React.createElement("li", null, "\u5F00\u542F\u300C\u542F\u7528\u90AE\u4EF6\u53D1\u9001\u300D\u5F00\u5173")),
                                React.createElement("p", { className: "text-xs text-muted-foreground/60 mt-2" }, "\u672A\u914D\u7F6E\u65F6\u81EA\u52A8\u4F7F\u7528\u5F00\u53D1\u6A21\u5F0F\uFF08\u9A8C\u8BC1\u7801\u663E\u793A\u5728\u9875\u9762\uFF09")),
                            React.createElement("div", { className: "flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/30" },
                                React.createElement("div", null,
                                    React.createElement("p", { className: "font-medium text-foreground text-sm" }, "\u542F\u7528\u90AE\u4EF6\u53D1\u9001"),
                                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "\u5F00\u542F\u540E\u7528\u6237\u9886\u53D6\u5361\u5BC6\u65F6\u9700\u8981\u90AE\u7BB1\u9A8C\u8BC1")),
                                React.createElement("button", { onClick: function () { return setSmtpConfig(function (c) { return (__assign(__assign({}, c), { enabled: !c.enabled })); }); }, className: (0, utils_1.cn)('w-12 h-6 rounded-full transition-all duration-300 relative', smtpConfig.enabled ? 'bg-primary' : 'bg-muted') },
                                    React.createElement("div", { className: (0, utils_1.cn)('absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all duration-300', smtpConfig.enabled ? 'left-6' : 'left-0.5') }))),
                            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, null, "SMTP \u670D\u52A1\u5668"),
                                    React.createElement(input_1.Input, { placeholder: "smtp.qq.com", value: smtpConfig.host, onChange: function (e) { return setSmtpConfig(function (c) { return (__assign(__assign({}, c), { host: e.target.value })); }); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50" })),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, null, "\u7AEF\u53E3"),
                                    React.createElement(input_1.Input, { type: "number", placeholder: "465", value: smtpConfig.port, onChange: function (e) { return setSmtpConfig(function (c) { return (__assign(__assign({}, c), { port: parseInt(e.target.value) || 0 })); }); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50" })),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, null, "\u53D1\u4EF6\u90AE\u7BB1"),
                                    React.createElement(input_1.Input, { placeholder: "your@email.com", value: smtpConfig.fromEmail, onChange: function (e) { return setSmtpConfig(function (c) { return (__assign(__assign({}, c), { fromEmail: e.target.value })); }); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50" })),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, null, "\u53D1\u4EF6\u4EBA\u540D\u79F0"),
                                    React.createElement(input_1.Input, { placeholder: "GPT Image2", value: smtpConfig.fromName, onChange: function (e) { return setSmtpConfig(function (c) { return (__assign(__assign({}, c), { fromName: e.target.value })); }); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50" })),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, null, "\u90AE\u7BB1\u8D26\u53F7"),
                                    React.createElement(input_1.Input, { placeholder: "SMTP \u767B\u5F55\u7528\u6237\u540D", value: smtpConfig.username, onChange: function (e) { return setSmtpConfig(function (c) { return (__assign(__assign({}, c), { username: e.target.value })); }); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50" })),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(label_1.Label, null, "\u90AE\u7BB1\u5BC6\u7801 / \u6388\u6743\u7801"),
                                    React.createElement(input_1.Input, { type: "password", placeholder: "SMTP \u767B\u5F55\u5BC6\u7801\u6216\u6388\u6743\u7801", value: smtpConfig.password, onChange: function (e) { return setSmtpConfig(function (c) { return (__assign(__assign({}, c), { password: e.target.value })); }); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50" }))),
                            React.createElement("div", { className: "p-4 bg-secondary/30 rounded-lg border border-border/30" },
                                React.createElement("p", { className: "text-xs font-semibold text-muted-foreground mb-2" }, "\u5E38\u7528 SMTP \u53C2\u8003"),
                                React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground" },
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement(lucide_react_1.Server, { className: "w-3 h-3" }),
                                        React.createElement("span", null, "QQ\u90AE\u7BB1: smtp.qq.com:465")),
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement(lucide_react_1.Server, { className: "w-3 h-3" }),
                                        React.createElement("span", null, "\u7F51\u6613163: smtp.163.com:465")),
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement(lucide_react_1.Server, { className: "w-3 h-3" }),
                                        React.createElement("span", null, "Gmail: smtp.gmail.com:465")))),
                            React.createElement("div", { className: "flex gap-3" },
                                React.createElement(button_1.Button, { onClick: handleSaveSmtp, className: "gap-2 glow-cyan hover:glow-cyan" },
                                    React.createElement(lucide_react_1.CheckCircle2, { className: "w-4 h-4" }),
                                    "\u4FDD\u5B58\u914D\u7F6E"),
                                React.createElement(button_1.Button, { variant: "outline", onClick: handleTestSmtp, disabled: testingSmtp, className: "gap-2 border-border/30" },
                                    testingSmtp ? (React.createElement("div", { className: "w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" })) : (React.createElement(lucide_react_1.Mail, { className: "w-4 h-4" })),
                                    testingSmtp ? '测试中...' : '测试连接')),
                            smtpTestResult && (React.createElement("div", { className: (0, utils_1.cn)('flex items-center gap-2 p-3 rounded-lg text-sm', smtpTestResult.success
                                    ? 'bg-green-400/10 border border-green-400/30 text-green-400'
                                    : 'bg-destructive/10 border border-destructive/30 text-destructive') },
                                smtpTestResult.success ? React.createElement(lucide_react_1.CheckCircle2, { className: "w-4 h-4 shrink-0" }) : React.createElement(lucide_react_1.XCircle, { className: "w-4 h-4 shrink-0" }),
                                smtpTestResult.message)))))),
            React.createElement(dialog_1.Dialog, { open: showBatchDialog, onOpenChange: setShowBatchDialog },
                React.createElement(dialog_1.DialogContent, { className: "glass-card border-border/30 max-w-lg" },
                    React.createElement(dialog_1.DialogHeader, null,
                        React.createElement(dialog_1.DialogTitle, { className: "flex items-center gap-2" },
                            React.createElement(lucide_react_1.ListPlus, { className: "w-5 h-5 text-primary" }),
                            "\u6279\u91CF\u6DFB\u52A0\u5361\u5BC6")),
                    React.createElement("div", { className: "space-y-4 pt-2" },
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(label_1.Label, null, "\u5361\u5BC6\u5217\u8868\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF09"),
                            React.createElement(textarea_1.Textarea, { placeholder: "VIP-XXXX-XXXX\nVIP-YYYY-YYYY\nVIP-ZZZZ-ZZZZ", value: batchCodes, onChange: function (e) { return setBatchCodes(e.target.value.toUpperCase()); }, rows: 8, className: "bg-secondary/50 border-border/50 focus:border-primary/50 font-mono text-sm" }),
                            React.createElement("p", { className: "text-xs text-muted-foreground" }, "\u6BCF\u884C\u8F93\u5165\u4E00\u4E2A\u5361\u5BC6\u4EE3\u7801\uFF0C\u7A7A\u884C\u5C06\u88AB\u5FFD\u7565")),
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(label_1.Label, null, "\u5907\u6CE8\uFF08\u53EF\u9009\uFF0C\u7EDF\u4E00\u5E94\u7528\u4E8E\u6240\u6709\u5361\u5BC6\uFF09"),
                            React.createElement(input_1.Input, { placeholder: "\u5907\u6CE8\u4FE1\u606F", value: batchNote, onChange: function (e) { return setBatchNote(e.target.value); }, className: "bg-secondary/50 border-border/50 focus:border-primary/50" })),
                        React.createElement("div", { className: "flex gap-3 justify-end" },
                            React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setShowBatchDialog(false); } }, "\u53D6\u6D88"),
                            React.createElement(button_1.Button, { onClick: handleBatchAdd, className: "glow-cyan" }, "\u6279\u91CF\u6DFB\u52A0"))))),
            React.createElement(dialog_1.Dialog, { open: showAnnounceDialog, onOpenChange: function (v) { setShowAnnounceDialog(v); if (!v)
                    setEditingAnnouncement(null); } },
                React.createElement(dialog_1.DialogContent, { className: "glass-card border-border/30 max-w-lg" },
                    React.createElement(dialog_1.DialogHeader, null,
                        React.createElement(dialog_1.DialogTitle, null, editingAnnouncement ? '编辑公告' : '发布公告')),
                    React.createElement("div", { className: "space-y-4 pt-2" },
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(label_1.Label, null, "\u6807\u9898"),
                            React.createElement(input_1.Input, { value: announceTitle, onChange: function (e) { return setAnnounceTitle(e.target.value); }, placeholder: "\u516C\u544A\u6807\u9898", className: "bg-secondary/50 border-border/50" })),
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(label_1.Label, null, "\u4F18\u5148\u7EA7"),
                            React.createElement("div", { className: "flex gap-2" }, ['low', 'medium', 'high'].map(function (p) { return (React.createElement(button_1.Button, { key: p, variant: announcePriority === p ? 'default' : 'outline', size: "sm", onClick: function () { return setAnnouncePriority(p); }, className: (0, utils_1.cn)(announcePriority === p ? '' : 'border-border/30', p === 'high' && announcePriority === p && 'bg-destructive hover:bg-destructive/90', p === 'medium' && announcePriority === p && 'bg-yellow-500 hover:bg-yellow-500/90 text-black', p === 'low' && announcePriority === p && 'bg-blue-500 hover:bg-blue-500/90') }, p === 'high' ? '重要' : p === 'medium' ? '一般' : '普通')); }))),
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(label_1.Label, null, "\u5185\u5BB9"),
                            React.createElement(textarea_1.Textarea, { value: announceContent, onChange: function (e) { return setAnnounceContent(e.target.value); }, placeholder: "\u516C\u544A\u5185\u5BB9", rows: 4, className: "bg-secondary/50 border-border/50" })),
                        React.createElement("div", { className: "flex gap-3 justify-end" },
                            React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setShowAnnounceDialog(false); } }, "\u53D6\u6D88"),
                            React.createElement(button_1.Button, { onClick: handleSaveAnnouncement, className: "glow-cyan" }, editingAnnouncement ? '更新' : '发布'))))),
            React.createElement(alert_dialog_1.AlertDialog, { open: !!showDeleteConfirm, onOpenChange: function () { return setShowDeleteConfirm(null); } },
                React.createElement(alert_dialog_1.AlertDialogContent, { className: "glass-card border-border/30" },
                    React.createElement(alert_dialog_1.AlertDialogHeader, null,
                        React.createElement(alert_dialog_1.AlertDialogTitle, null, "\u786E\u8BA4\u5220\u9664"),
                        React.createElement(alert_dialog_1.AlertDialogDescription, null, "\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\uFF0C\u786E\u5B9A\u8981\u7EE7\u7EED\u5417\uFF1F")),
                    React.createElement(alert_dialog_1.AlertDialogFooter, null,
                        React.createElement(alert_dialog_1.AlertDialogCancel, null, "\u53D6\u6D88"),
                        React.createElement(alert_dialog_1.AlertDialogAction, { onClick: function () {
                                if (showDeleteConfirm === null || showDeleteConfirm === void 0 ? void 0 : showDeleteConfirm.startsWith('announce-')) {
                                    handleDeleteAnnouncement(showDeleteConfirm.replace('announce-', ''));
                                }
                                else if (showDeleteConfirm) {
                                    handleDeleteKey(showDeleteConfirm);
                                }
                            }, className: "bg-destructive hover:bg-destructive/90" }, "\u5220\u9664")))),
            React.createElement(dialog_1.Dialog, { open: showPasswordDialog, onOpenChange: setShowPasswordDialog },
                React.createElement(dialog_1.DialogContent, { className: "glass-card border-border/30" },
                    React.createElement(dialog_1.DialogHeader, null,
                        React.createElement(dialog_1.DialogTitle, null, "\u4FEE\u6539\u7BA1\u7406\u5458\u5BC6\u7801")),
                    React.createElement("div", { className: "space-y-4 pt-2" },
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(label_1.Label, null, "\u65B0\u5BC6\u7801"),
                            React.createElement(input_1.Input, { type: "password", value: newPassword, onChange: function (e) { return setNewPassword(e.target.value); }, placeholder: "\u8F93\u5165\u65B0\u5BC6\u7801\uFF08\u81F3\u5C114\u4E2A\u5B57\u7B26\uFF09", className: "bg-secondary/50 border-border/50" })),
                        React.createElement("div", { className: "flex gap-3 justify-end" },
                            React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setShowPasswordDialog(false); } }, "\u53D6\u6D88"),
                            React.createElement(button_1.Button, { onClick: handleChangePassword, className: "glow-cyan" }, "\u786E\u8BA4\u4FEE\u6539"))))))));
}
