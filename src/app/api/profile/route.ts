import { prisma } from '@/db/prisma';
import { AuthenticatedRequest, authMiddleware } from '@/middleware/auth';
import { updateUserValidation } from '@/utils/validation';
import { NextResponse } from 'next/server';

export async function GET(req: AuthenticatedRequest) {
  try {
    const auth = authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          statusCode: 404,
          success: false,
          message: 'User not found',
          data: null,
          error: 'Not Found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message: 'User found successfully',
        data: user,
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/profile GET :' + (error as Error).message,
        data: null,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: AuthenticatedRequest) {
  try {
    const auth = authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    const { error, value } = updateUserValidation(body);

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
        id: req.user?.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          statusCode: 404,
          success: false,
          message: 'User not found',
          data: null,
          error: 'Not Found',
        },
        { status: 404 }
      );
    }

    const update = await prisma.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        name: value.name,
        email: value.email,
        password: value.password,
      },
    });

    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
        data: update,
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/profile PUT :' + (error as Error).message,
        data: null,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: AuthenticatedRequest) {
  try {
    const auth = authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          statusCode: 404,
          success: false,
          message: 'User not found',
          data: null,
          error: 'Not Found',
        },
        { status: 404 }
      );
    }

    const deleteUser = await prisma.user.delete({
      where: {
        id: req.user?.id,
      },
    });

    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message: 'User deleted successfully',
        data: deleteUser,
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/profile GET :' + (error as Error).message,
        data: null,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
