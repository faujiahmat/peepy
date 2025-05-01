import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../utils/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
  };
}

export function authMiddleware(
  request: NextRequest
): AuthenticatedRequest | NextResponse {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      {
        statusCode: 401,
        success: false,
        message: 'Unauthorized: No token provided',
        data: null,
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as { id: string };

    const authenticatedRequest: AuthenticatedRequest = Object.assign(request, {
      user: { id: decoded.id },
    });

    return authenticatedRequest;
  } catch (error: Error | unknown) {
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: 'Error at middleware.ts : ' + (error as Error).message,
      data: null,
      error: 'Internal Server Error',
    });
  }
}
