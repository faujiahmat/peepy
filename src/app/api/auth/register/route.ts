import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { encrypt } from '@/utils/bcrypt';
import validator from 'validator';
import { registerUserValidation } from '@/utils/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error, value } = registerUserValidation(body);

    if (error != null) {
      return NextResponse.json(
        {
          statusCode: 400,
          success: false,
          message: error.details[0].message,
          data: value,
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { email: String(value.email) },
    });
    if (userExists) {
      return NextResponse.json(
        {
          statusCode: 400,
          success: false,
          message: 'Email has been registered',
          data: null,
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    if (!validator.isEmail(value.email)) {
      return NextResponse.json(
        {
          statusCode: 400,
          success: false,
          message: 'Email is not valid',
          data: null,
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    // if (!validator.isStrongPassword(value.password)) {
    //   return NextResponse.json(
    //     {
    //       statusCode: 400,
    //       success: false,
    //       message:
    //         'Password is too weak: combination of uppercase letters, lowercase letters, numbers, and symbols',
    //       data: null,
    //       error: 'Bad Request',
    //     },
    //     { status: 400 }
    //   );
    // }

    const hashPassword = encrypt(value.password);

    const newUser = await prisma.user.create({
      data: {
        email: value.email,
        name: value.name,
        password: hashPassword,
      },
    });

    return NextResponse.json(
      {
        statusCode: 201,
        success: true,
        message: 'User created successfully',
        data: newUser,
        error: null,
      },
      { status: 201 }
    );
  } catch (error: Error | unknown) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/auth/register : ' + (error as Error).message,
        data: null,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
