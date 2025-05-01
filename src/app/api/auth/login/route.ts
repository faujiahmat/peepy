import { prisma } from '@/db/prisma';
import { compare } from '@/utils/bcrypt';
import { generateToken } from '@/utils/jwt';
import { loginUserValidation } from '@/utils/validation';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    const { error, value } = loginUserValidation(requestBody);

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

    const user = await prisma.user.findUnique({
      where: {
        email: String(value.email),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          statusCode: 404,
          success: false,
          message: 'Wrong email or password',
          data: null,
          error: 'Not Found',
        },
        { status: 404 }
      );
    }

    if (!compare(value.password, user.password)) {
      return NextResponse.json(
        {
          statusCode: 400,
          success: false,
          message: 'Wrong email or password',
          data: null,
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    const token = generateToken({ id: String(user.id) });

    const response = NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message: 'Login successfully',
        data: { ...user, token },
        error: null,
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 2,
    });

    return response;
  } catch (error: Error | unknown) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/auth/login : ' + (error as Error).message,
        data: null,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
