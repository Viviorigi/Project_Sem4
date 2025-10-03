import 'dart:io';
import 'package:ecommerce_sem4/models/user/account/response/account_model.dart';
import 'package:ecommerce_sem4/services/user/account/account_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserDetailsModal extends StatefulWidget {
  const UserDetailsModal({Key? key}) : super(key: key);

  @override
  State<UserDetailsModal> createState() => _UserDetailsModalState();
}

class _UserDetailsModalState extends State<UserDetailsModal> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();

  String? _gender = 'Male';
  XFile? _avatar;

  final _picker = ImagePicker();
  final apiGetDetailAccount = getByIdAccountUri;

  String? accessToken = "";
  String? userId = "";
  Map<String, String> headers = {};
  Account? account;

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchUserDetails();
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _fetchUserDetails() async {
    setState(() => _isLoading = true);

    final pref = await SharedPreferences.getInstance();
    accessToken = pref.getString("accessToken");
    userId = pref.getString("id");

    headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $accessToken',
    };

    final data = await AccountService().detail("$apiGetDetailAccount/$userId", headers);

    if (!mounted) return;
    account = data;
    _usernameController.text = account?.userName ?? "";
    _phoneController.text = account?.phoneNumber ?? "";
    _addressController.text = account?.address ?? "";
    _gender = (account?.gender?.toString() == '0') ? 'Female' : 'Male';

    setState(() => _isLoading = false);
  }

  Future<void> _pickAvatar() async {
    final img = await _picker.pickImage(source: ImageSource.gallery);
    if (!mounted) return;
    setState(() => _avatar = img);
  }

  Future<void> _submitForm(BuildContext context) async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final body = {
      'Username': _usernameController.text.trim(),
      'Phone': _phoneController.text.trim(),
      'Address': _addressController.text.trim(),
      'Gender': _gender == 'Male' ? '1' : '0',
    };

    final res = await AccountService().update("$updateAccountUri/$userId", headers, body);

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (res != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Details saved successfully!')),
      );
      Navigator.pop(context, true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to save details')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screen = MediaQuery.of(context).size;

    // Full-width + auto né bàn phím
    return AnimatedPadding(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeOut,
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Material(
        color: kSurface,
        borderRadius: BorderRadius.zero,             // full screen cảm giác phẳng
        child: Container(
          width: double.infinity,                     // <- full width
          constraints: BoxConstraints(
            maxHeight: screen.height * 0.95,          // cao tới 95% màn
          ),
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
          decoration: BoxDecoration(
            color: kSurface,
            borderRadius: BorderRadius.zero,
            border: Border.all(color: kStroke),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(.06),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Stack(
            children: [
              // Nội dung có thể cuộn
              SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Title bar
                    Row(
                      children: [
                        const Text(
                          "Edit profile",
                          style: TextStyle(
                            color: kInk,
                            fontWeight: FontWeight.w800,
                            fontSize: 18,
                          ),
                        ),
                        const Spacer(),
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.close, color: kMuted),
                          tooltip: "Close",
                        )
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Avatar + email
                    Row(
                      children: [
                        Stack(
                          children: [
                            Container(
                              width: 72,
                              height: 72,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(color: kStroke),
                              ),
                              child: ClipOval(
                                child: _avatar != null
                                    ? Image.file(File(_avatar!.path), fit: BoxFit.cover)
                                    : (account?.avatar != null && account!.avatar!.isNotEmpty)
                                    ? Image.network(
                                  "http://10.0.2.2:5069/images/${account!.avatar!}",
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => Image.asset(
                                    "assets/user/images/avatar.png",
                                    fit: BoxFit.cover,
                                  ),
                                )
                                    : Image.asset(
                                  "assets/user/images/avatar.png",
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            // Positioned(
                            //   right: -2,
                            //   bottom: -2,
                            //   child: Material(
                            //     color: kAccentDark,
                            //     shape: const CircleBorder(),
                            //     child: InkWell(
                            //       customBorder: const CircleBorder(),
                            //       onTap: _pickAvatar,
                            //       child: const Padding(
                            //         padding: EdgeInsets.all(6),
                            //         child: Icon(Icons.edit, size: 16, color: Colors.white),
                            //       ),
                            //     ),
                            //   ),
                            // )
                          ],
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            account?.email ?? '',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: kMuted,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          _ModernField(
                            label: "Username",
                            hint: "Enter your name",
                            controller: _usernameController,
                            validator: (v) =>
                            (v == null || v.trim().isEmpty) ? 'Please enter a username' : null,
                          ),
                          const SizedBox(height: 12),
                          _ModernField(
                            label: "Phone",
                            hint: "Enter your phone",
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                          ),
                          const SizedBox(height: 12),
                          _ModernField(
                            label: "Address",
                            hint: "Enter your address",
                            controller: _addressController,
                          ),
                          const SizedBox(height: 12),

                          // Gender
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                "Gender",
                                style: TextStyle(
                                  color: kInk,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 13.5,
                                ),
                              ),
                              const SizedBox(height: 6),
                              DropdownButtonFormField<String>(
                                value: _gender,
                                decoration: _inputDecoration(),
                                items: const [
                                  DropdownMenuItem(value: 'Male', child: Text('Male')),
                                  DropdownMenuItem(value: 'Female', child: Text('Female')),
                                ],
                                onChanged: (v) => setState(() => _gender = v),
                              ),
                            ],
                          ),

                          const SizedBox(height: 18),

                          // Buttons
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton(
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(vertical: 14),
                                    side: BorderSide(color: kStroke),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    foregroundColor: kInk,
                                    textStyle: const TextStyle(fontWeight: FontWeight.w700),
                                  ),
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text("Close"),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(vertical: 14),
                                    backgroundColor: kAccentDark,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    textStyle: const TextStyle(fontWeight: FontWeight.w700),
                                  ),
                                  onPressed: () => _submitForm(context),
                                  child: const Text("Save"),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Loading overlay
              if (_isLoading)
                Positioned.fill(
                  child: Container(
                    color: Colors.white.withOpacity(.6),
                    child: const Center(child: CircularProgressIndicator(strokeWidth: 2)),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  // Input decoration theo theme
  InputDecoration _inputDecoration({String? hint}) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: kMuted, fontSize: 13.5),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: kStroke, width: 1),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: kAccentDark, width: 1.4),
      ),
    );
  }
}

class _ModernField extends StatelessWidget {
  final String label;
  final String hint;
  final TextEditingController controller;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;

  const _ModernField({
    required this.label,
    required this.hint,
    required this.controller,
    this.validator,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
              color: kInk,
              fontWeight: FontWeight.w600,
              fontSize: 13.5,
            )),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          validator: validator,
          keyboardType: keyboardType,
          style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w500),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: kMuted, fontSize: 13.5),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: kStroke, width: 1),
            ),
            focusedBorder: const OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(12)),
              borderSide: BorderSide(color: kAccentDark, width: 1.4),
            ),
          ),
        ),
      ],
    );
  }
}
