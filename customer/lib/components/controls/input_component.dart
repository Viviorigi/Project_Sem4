
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';

class InputComponent extends StatelessWidget{
  final String text;
  final String placeholder;
  final TextEditingController controller;
  final FormFieldValidator<String>?  validator;
  const InputComponent({super.key, required this.text, required this.placeholder, required this.controller, required this.validator});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
         Text(
          text,
          style: const TextStyle(
              fontWeight: FontWeight.w500,
              fontFamily: "Poppins",
              color: blackColor,
              fontSize: 15
          ),
        ),
        const SizedBox(height: 10,),
        TextFormField(
          controller: controller,
          validator: validator,
          decoration:  InputDecoration(
            enabledBorder: const OutlineInputBorder(
              borderSide: BorderSide(color: borderInput, width: 1.0),
              borderRadius: BorderRadius.all(Radius.circular(10.0)),
            ),
            border: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
            focusedBorder:const OutlineInputBorder(
              borderSide: BorderSide(color: borderInput, width: 1.0),
              borderRadius: BorderRadius.all(Radius.circular(10.0)),
            ),
            fillColor: Colors.white,
            hintText: placeholder,
            contentPadding: const EdgeInsets.symmetric(vertical: 15.0, horizontal: 20.0), // Add padding
            hintStyle: const TextStyle(color: greyColor),
          ),
        )
      ],
    );
  }
}