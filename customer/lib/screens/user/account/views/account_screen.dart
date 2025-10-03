import 'package:ecommerce_sem4/route/user/router_constants.dart';
import 'package:ecommerce_sem4/screens/user/account/views/account_order_screen.dart';
import 'package:ecommerce_sem4/screens/user/account/views/components/user_detail_modal_component.dart';
import 'package:ecommerce_sem4/services/user/account/account_service.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/models/user/account/response/account_model.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key});
  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  Account? _account;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      AuthService().checkLoginStatus(context);
    });
    _fetchAccount();
  }

  Future<void> _fetchAccount() async {
    setState(() => _loading = true);
    final pref = await SharedPreferences.getInstance();
    final token = pref.getString('accessToken');
    final userId = pref.getString('id');
    if (token == null || userId == null) {
      setState(() => _loading = false);
      return;
    }
    final headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $token',
    };
    final data = await AccountService().detail('$getByIdAccountUri/$userId', headers);
    if (!mounted) return;
    setState(() {
      _account = data;
      _loading = false;
    });
  }

  void _logout() {
    AuthService().logout();
    Navigator.pushReplacementNamed(context, onboardingScreenRoute);
  }

  void _goOrders() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const AccountOrderScreen()));
  }

  Future<void> _openUserDetailsModal() async {
    await showDialog(
      context: context,
      barrierDismissible: true,
      builder: (_) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding:  EdgeInsets.zero,
        child: const SizedBox(
          width: double.infinity,             // <- full width
          child: UserDetailsModal(),
        ),
      ),
    );
    // Sau khi đóng modal -> reload dữ liệu
    _fetchAccount();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: kCanvas,
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final avatarProvider = _account?.avatar != null && _account!.avatar!.isNotEmpty
        ? NetworkImage('http://10.0.2.2:5069/images/${_account!.avatar!}')
        : const AssetImage('assets/user/images/avatar.png') as ImageProvider;

    return SafeArea(
      child: Scaffold(
        backgroundColor: kCanvas,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          backgroundColor: kAccentDark,
          elevation: 0,
          title: const Text('Profile', style: TextStyle(color: Colors.white)),
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // -------- Profile card --------
              Container(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 18),
                decoration: BoxDecoration(
                  color: kSurface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: kStroke),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(.05),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Container(
                      width: 92,
                      height: 92,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: kStroke),
                      ),
                      child: CircleAvatar(
                        backgroundImage: avatarProvider,
                        backgroundColor: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _account?.userName ?? 'User',
                      style: const TextStyle(
                        color: kInk,
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _account?.email ?? '',
                      style: const TextStyle(
                        color: kMuted,
                        fontSize: 13.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _QuickAction(
                            icon: Icons.shopping_bag_outlined,
                            label: 'Orders',
                            onTap: _goOrders,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // -------- Settings list --------
              Container(
                decoration: BoxDecoration(
                  color: kSurface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: kStroke),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(.05),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    _SettingItem(
                      icon: Icons.account_circle_outlined,
                      text: 'User details',
                      onTap: _openUserDetailsModal,
                    ),
                    const _DividerThin(),
                    _SettingItem(
                      icon: Icons.logout,
                      text: 'Logout',
                      danger: true,
                      onTap: _logout,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------- Sub-widgets ----------
class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            border: Border.all(color: kStroke),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            children: [
              Icon(icon, color: kAccentDark, size: 22),
              const SizedBox(height: 6),
              Text(
                label,
                style: const TextStyle(
                  color: kInk,
                  fontSize: 13.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SettingItem extends StatelessWidget {
  final IconData icon;
  final String text;
  final VoidCallback onTap;
  final bool danger;

  const _SettingItem({
    required this.icon,
    required this.text,
    required this.onTap,
    this.danger = false,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          border: Border.all(color: kStroke),
          borderRadius: BorderRadius.circular(10),
          color: Colors.white,
        ),
        child: Icon(icon, color: danger ? kDanger : kAccentDark, size: 22),
      ),
      title: Text(
        text,
        style: TextStyle(
          color: danger ? kDanger : kInk,
          fontWeight: FontWeight.w700,
          fontSize: 15,
        ),
      ),
      trailing: const Icon(Icons.chevron_right, color: kMuted),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
      minLeadingWidth: 0,
    );
  }
}

class _DividerThin extends StatelessWidget {
  const _DividerThin();

  @override
  Widget build(BuildContext context) {
    return const Divider(
      color: kStroke,
      height: 1,
      thickness: 1,
      indent: 14,
      endIndent: 14,
    );
  }
}
