import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { AuthenticatedRequest, authMiddleware } from '@/middleware/auth';
import { createTodoValidation } from '@/utils/validation';

export async function GET(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const auth = authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const todo = await prisma.todo.findUnique({
      where: {
        id: resolvedParams.id,
        userId: req.user?.id,
      },
    });

    if (!todo)
      return NextResponse.json(
        {
          statusCode: 404,
          success: false,
          message: 'Todo not found',
          data: null,
          error: 'Not Found',
        },
        { status: 404 }
      );

    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message: 'Todo found successfully',
        data: todo,
        error: null,
      },
      { status: 200 }
    );
  } catch (error: Error | unknown) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/todo/:id GET :' + (error as Error).message,
        data: null,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const auth = authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    const { error, value } = createTodoValidation(body);

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

    const existingTodo = await prisma.todo.findUnique({
      where: {
        id: resolvedParams.id,
        userId: req.user?.id,
      },
    });

    if (!existingTodo) {
      return NextResponse.json(
        {
          statusCode: 404,
          success: false,
          message: 'Todo not found',
          data: null,
          error: 'Not Found',
        },
        { status: 404 }
      );
    }

    const updated = await prisma.todo.update({
      where: {
        id: resolvedParams.id,
        userId: req.user?.id,
      },
      data: {
        title: value.title,
        description: value.description,
        status: value.status,
      },
    });

    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message: 'Todo updated successfully',
        data: updated,
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/todo/:id PUT :' + (error as Error).message,
        data: null,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const auth = authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const existingTodo = await prisma.todo.findUnique({
      where: {
        id: resolvedParams.id,
        userId: req.user?.id,
      },
    });

    if (!existingTodo) {
      return NextResponse.json(
        {
          statusCode: 404,
          success: false,
          message: 'Todo not found',
          data: null,
          error: 'Not Found',
        },
        { status: 404 }
      );
    }

    await prisma.todo.delete({
      where: {
        id: resolvedParams.id,
        userId: req.user?.id,
      },
    });

    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message: 'Todo deleted successfully',
        data: null,
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/todo/:id DELETE :' + (error as Error).message,
        data: null,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
